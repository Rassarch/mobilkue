import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const cars = [
    {
      title: "Toyota Avanza 2021",
      slug: "toyota-avanza-2021",
      price: 185000000,
      year: 2021,
      brand: "Toyota",
      mileage: 40000,
      transmission: "Manual",
      fuelType: "Bensin",
      description: "Mobil terawat, siap pakai",
      images: ["/image1.jfif"],
    },
    {
      title: "Honda Brio 2022",
      slug: "honda-brio-2022",
      price: 210000000,
      year: 2022,
      brand: "Honda",
      mileage: 12000,
      transmission: "Automatic",
      fuelType: "Bensin",
      description: "Low KM, seperti baru",
      images: ["/image2.jpg"],
    },
  ];

  for (const carData of cars) {
    const { images, ...car } = carData;
    await prisma.car.upsert({
      where: { slug: car.slug },
      update: {},
      create: {
        ...car,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });