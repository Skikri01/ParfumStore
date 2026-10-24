import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ categories });
  } catch (error: any) {
    console.error('getCategories error:', error);
    res.status(500).json({ message: 'Error retrieving categories.' });
  }
};
