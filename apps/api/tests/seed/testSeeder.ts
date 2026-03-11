import { prisma } from '../../src/lib/prisma';

export async function seedBasicData() {
  const category = await prisma.category.create({
    data: {
      name: 'Music',
      slug: 'music',
    },
  });

  const location = await prisma.location.create({
    data: {
      name: 'Jakarta',
      slug: 'jakarta',
      country: 'Indonesia',
    },
  });

  return { category, location };
}
