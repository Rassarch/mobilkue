import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import CarForm from "../../components/CarForm";
import { notFound } from "next/navigation";

export default async function EditCarPage({
    params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!car) notFound();

  return <CarForm car={car} />;
}