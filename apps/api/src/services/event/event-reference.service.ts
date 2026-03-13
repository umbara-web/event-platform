import prisma from '../../configs/database';

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getLocations() {
  return prisma.location.findMany({
    orderBy: { name: 'asc' },
  });
}
