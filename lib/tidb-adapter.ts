/**
 * Custom Prisma 7 Driver Adapter for TiDB Cloud Serverless (HTTPS).
 * 
 * Bridges @tidbcloud/serverless (HTTP-based) to Prisma 7's SqlDriverAdapterFactory interface.
 * This is necessary because:
 * - @tidbcloud/prisma-adapter only supports Prisma 5-6
 * - @prisma/adapter-mariadb uses TCP which doesn't work from Vercel serverless
 * - TiDB Cloud Serverless only supports HTTPS from serverless environments
 */

import { ColumnTypeEnum } from "@prisma/driver-adapter-utils";
import type {
  SqlDriverAdapter,
  SqlDriverAdapterFactory,
  SqlQuery,
  SqlQueryable,
  SqlResultSet,
  Transaction,
  TransactionOptions,
  ConnectionInfo,
  IsolationLevel,
  ColumnType,
} from "@prisma/driver-adapter-utils";
import { connect, type Connection, type Tx } from "@tidbcloud/serverless";

// Map TiDB/MySQL type strings to Prisma ColumnType enums
function mapTiDBColumnType(typeName: string): ColumnType {
  switch (typeName) {
    case "TINYINT":
    case "UNSIGNED TINYINT":
    case "SMALLINT":
    case "UNSIGNED SMALLINT":
    case "MEDIUMINT":
    case "UNSIGNED MEDIUMINT":
    case "INT":
    case "YEAR":
      return ColumnTypeEnum.Int32;

    case "UNSIGNED INT":
    case "BIGINT":
    case "UNSIGNED BIGINT":
      return ColumnTypeEnum.Int64;

    case "FLOAT":
      return ColumnTypeEnum.Float;

    case "DOUBLE":
      return ColumnTypeEnum.Double;

    case "DECIMAL":
      return ColumnTypeEnum.Numeric;

    case "CHAR":
    case "VARCHAR":
    case "TEXT":
    case "TINYTEXT":
    case "MEDIUMTEXT":
    case "LONGTEXT":
      return ColumnTypeEnum.Text;

    case "DATE":
      return ColumnTypeEnum.Date;

    case "TIME":
      return ColumnTypeEnum.Time;

    case "DATETIME":
    case "TIMESTAMP":
      return ColumnTypeEnum.DateTime;

    case "JSON":
      return ColumnTypeEnum.Json;

    case "BLOB":
    case "TINYBLOB":
    case "MEDIUMBLOB":
    case "LONGBLOB":
    case "BINARY":
    case "VARBINARY":
    case "BIT":
      return ColumnTypeEnum.Bytes;

    case "ENUM":
      return ColumnTypeEnum.Enum;

    case "SET":
      return ColumnTypeEnum.Text;

    default:
      return ColumnTypeEnum.Text;
  }
}

// Format query with positional parameters (? placeholders)
function buildQuery(query: SqlQuery): { sql: string; values: unknown[] } {
  return {
    sql: query.sql,
    values: query.args.map((arg, i) => {
      if (arg === null) return null;

      const argType = query.argTypes[i];
      if (!argType) return arg;

      // Force conversion to numbers for integer types to fix LIMIT/OFFSET issues
      if (argType.scalarType === "int" || argType.scalarType === "bigint") {
        const num = Number(arg);
        if (!isNaN(num)) return num;
      }

      if (typeof arg === "string" && argType.scalarType === "bytes") {
        return arg; // Keep as base64 string
      }

      return arg;
    }),
  };
}



// Execute a query using TiDB serverless connection
async function executeQuery(
  conn: Connection<any> | Tx<any>,
  query: SqlQuery
): Promise<{ rows: unknown[][]; types: Record<string, string>; rowsAffected: number; lastInsertId: string | null }> {
  const { sql, values } = buildQuery(query);

  const result = await (conn as Connection<any>).execute(sql, values, {
    fullResult: true,
    arrayMode: true,
  }) as any;

  return {
    rows: result.rows ?? [],
    types: result.types ?? {},
    rowsAffected: result.rowsAffected ?? 0,
    lastInsertId: result.lastInsertId ?? null,
  };
}

class TiDBQueryable implements SqlQueryable {
  readonly provider = "mysql" as const;
  readonly adapterName = "prisma-tidb-serverless-adapter";

  constructor(protected conn: Connection<any> | Tx<any>) {}

  async queryRaw(query: SqlQuery): Promise<SqlResultSet> {
    const result = await executeQuery(this.conn, query);

    const typeEntries = Object.entries(result.types);
    const columnNames = typeEntries.map(([name]) => name);
    const columnTypes = typeEntries.map(([, type]) => mapTiDBColumnType(type));

    // Process rows
    const rows = (result.rows ?? []).map((row: unknown[]) =>
      row.map((value, i) => {
        if (value === null) return null;

        const colType = columnTypes[i];
        // Convert datetime strings to ISO format
        if (
          colType === ColumnTypeEnum.DateTime &&
          typeof value === "string" &&
          !value.includes("T")
        ) {
          return new Date(`${value}Z`)
            .toISOString()
            .replace(/(\\.000)?Z$/, "+00:00");
        }

        return value;
      })
    );

    return {
      columnNames,
      columnTypes,
      rows,
      lastInsertId: result.lastInsertId?.toString(),
    };
  }

  async executeRaw(query: SqlQuery): Promise<number> {
    const result = await executeQuery(this.conn, query);
    return result.rowsAffected ?? 0;
  }
}

class TiDBTransaction extends TiDBQueryable implements Transaction {
  readonly options: TransactionOptions = { usePhantomQuery: true };

  constructor(private tx: Tx<any>) {
    super(tx as unknown as Connection<any>);
  }

  async commit(): Promise<void> {
    await this.tx.commit();
  }

  async rollback(): Promise<void> {
    await this.tx.rollback();
  }
}

class TiDBAdapter extends TiDBQueryable implements SqlDriverAdapter {
  constructor(conn: Connection<any>) {
    super(conn);
  }

  async executeScript(_script: string): Promise<void> {
    throw new Error("executeScript is not supported with TiDB serverless");
  }

  getConnectionInfo(): ConnectionInfo {
    return {
      supportsRelationJoins: false,
    };
  }

  async startTransaction(isolationLevel?: IsolationLevel): Promise<Transaction> {
    const txOptions: Record<string, string> = {};
    if (isolationLevel) {
      txOptions.isolation = isolationLevel;
    }
    const tx = await (this.conn as Connection<any>).begin(txOptions as any);
    return new TiDBTransaction(tx);
  }

  async dispose(): Promise<void> {
    // No-op for HTTP connections
  }
}

export interface TiDBServerlessConfig {
  url: string;
  username?: string;
  password?: string;
  database?: string;
}

export class PrismaTiDBServerless implements SqlDriverAdapterFactory {
  readonly provider = "mysql" as const;
  readonly adapterName = "prisma-tidb-serverless-adapter";

  #config: TiDBServerlessConfig;

  constructor(config: TiDBServerlessConfig) {
    this.#config = config;
  }

  async connect(): Promise<SqlDriverAdapter> {
    const conn = connect({
      url: this.#config.url,
      username: this.#config.username,
      password: this.#config.password,
      database: this.#config.database,
    });
    return new TiDBAdapter(conn);
  }
}
