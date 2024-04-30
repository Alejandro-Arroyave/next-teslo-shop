import { initialData } from "./seed";
import prisma from "../lib/prisma";
import { capitalize } from "../utils/index";

async function main() {
  // Delete previous registers
  // await Promise.all([
  await prisma.product.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.category.deleteMany();
  // ]);

  const { categories, products } = initialData;

  // Categories
  const categoriesData = categories.map((category) => ({
    name: capitalize(category),
  }));

  await prisma.category.createMany({ data: categoriesData });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>); // <label, categoryId>

  // Products
  products.forEach(async (product) => {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    // Images
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log("Seed succesfully completed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();