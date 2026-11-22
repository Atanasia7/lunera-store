import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const dresses = await prisma.category.upsert({
    where: { slug: "dresses" },
    update: {},
    create: {
      name: "Сукні",
      slug: "dresses",
    },
  });

  const blouses = await prisma.category.upsert({
    where: { slug: "blouses" },
    update: {},
    create: {
      name: "Блузи",
      slug: "blouses",
    },
  });

  const trousers = await prisma.category.upsert({
    where: { slug: "trousers" },
    update: {},
    create: {
      name: "Штани",
      slug: "trousers",
    },
  });

  const outerwear = await prisma.category.upsert({
    where: { slug: "outerwear" },
    update: {},
    create: {
      name: "Верхній одяг",
      slug: "outerwear",
    },
  });

  await prisma.product.upsert({
    where: { slug: "luna-midi-dress" },
    update: {},
    create: {
      name: "Сукня Luna Midi",
      slug: "luna-midi-dress",
      description:
        "Елегантна міді-сукня жіночого крою для повсякденних та вечірніх образів.",
      price: 2499,
      categoryId: dresses.id,
      variants: {
        create: [
          {
            size: "S",
            color: "Чорний",
            sku: "LUNA-DRESS-BLK-S",
            stock: 8,
          },
          {
            size: "M",
            color: "Чорний",
            sku: "LUNA-DRESS-BLK-M",
            stock: 10,
          },
          {
            size: "L",
            color: "Чорний",
            sku: "LUNA-DRESS-BLK-L",
            stock: 6,
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "aria-satin-dress" },
    update: {},
    create: {
      name: "Сукня Aria Satin",
      slug: "aria-satin-dress",
      description:
        "Лаконічна сатинова сукня з м’яким силуетом та мінімалістичним дизайном.",
      price: 2899,
      categoryId: dresses.id,
      variants: {
        create: [
          {
            size: "S",
            color: "Бежевий",
            sku: "ARIA-SATIN-BEI-S",
            stock: 7,
          },
          {
            size: "M",
            color: "Бежевий",
            sku: "ARIA-SATIN-BEI-M",
            stock: 9,
          },
          {
            size: "L",
            color: "Бежевий",
            sku: "ARIA-SATIN-BEI-L",
            stock: 5,
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "elise-blouse" },
    update: {},
    create: {
      name: "Блуза Elise",
      slug: "elise-blouse",
      description:
        "Жіноча блуза в мінімалістичному стилі для повсякденних та офісних образів.",
      price: 1599,
      categoryId: blouses.id,
      variants: {
        create: [
          {
            size: "S",
            color: "Білий",
            sku: "ELISE-WHT-S",
            stock: 12,
          },
          {
            size: "M",
            color: "Білий",
            sku: "ELISE-WHT-M",
            stock: 14,
          },
          {
            size: "L",
            color: "Білий",
            sku: "ELISE-WHT-L",
            stock: 8,
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "noir-wide-trousers" },
    update: {},
    create: {
      name: "Штани Noir Wide",
      slug: "noir-wide-trousers",
      description:
        "Широкі жіночі штани з високою посадкою та класичним силуетом.",
      price: 2199,
      categoryId: trousers.id,
      variants: {
        create: [
          {
            size: "S",
            color: "Чорний",
            sku: "NOIR-WIDE-BLK-S",
            stock: 10,
          },
          {
            size: "M",
            color: "Чорний",
            sku: "NOIR-WIDE-BLK-M",
            stock: 11,
          },
          {
            size: "L",
            color: "Чорний",
            sku: "NOIR-WIDE-BLK-L",
            stock: 7,
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "amelie-jacket" },
    update: {},
    create: {
      name: "Жакет Amelie",
      slug: "amelie-jacket",
      description:
        "Структурований жіночий жакет прямого крою для базового гардероба.",
      price: 3499,
      categoryId: outerwear.id,
      variants: {
        create: [
          {
            size: "S",
            color: "Сірий",
            sku: "AMELIE-GRY-S",
            stock: 6,
          },
          {
            size: "M",
            color: "Сірий",
            sku: "AMELIE-GRY-M",
            stock: 8,
          },
          {
            size: "L",
            color: "Сірий",
            sku: "AMELIE-GRY-L",
            stock: 4,
          },
        ],
      },
    },
  });

  console.log("Lunera database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });