"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCar(formData: any) {
  const { title, brand, year, price, mileage, transmission, fuelType, description, imageUrls } = formData;
  
  const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

  await prisma.car.create({
    data: {
      title,
      slug,
      brand,
      year: parseInt(year),
      price: parseInt(price),
      mileage: parseInt(mileage),
      transmission,
      fuelType,
      description,
      images: {
        create: imageUrls.map((url: string) => ({ url })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/admin");
}

export async function updateCar(id: string, formData: any) {
  const { title, brand, year, price, mileage, transmission, fuelType, description, isSold, imageUrls } = formData;

  await prisma.car.update({
    where: { id },
    data: {
      title,
      brand,
      year: parseInt(year),
      price: parseInt(price),
      mileage: parseInt(mileage),
      transmission,
      fuelType,
      description,
      isSold: isSold === "true" || isSold === true,
      images: {
        deleteMany: {},
        create: imageUrls.map((url: string) => ({ url })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath(`/cars/${formData.slug}`);
  revalidatePath("/admin");
}

export async function deleteCar(id: string) {
  await prisma.carImage.deleteMany({ where: { carId: id } });
  await prisma.car.delete({ where: { id } });
  
  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/admin");
}

export async function toggleSoldStatus(id: string, currentStatus: boolean) {
    await prisma.car.update({
        where: { id },
        data: { isSold: !currentStatus }
    });
    revalidatePath("/");
    revalidatePath("/cars");
    revalidatePath("/admin");
}
