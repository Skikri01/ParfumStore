import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, minPrice, maxPrice, volume, sort } = req.query;

    const where: any = {};

    if (category && category !== 'all') {
      const cat = String(category).toLowerCase();
      if (cat === 'men' || cat === 'homme') {
        where.OR = [
          { category: { slug: 'men' } },
          { category: { slug: 'woody' } },
          { description: { contains: 'Homme' } },
          { description: { contains: 'Men' } },
          { name: { contains: 'Homme' } },
          { name: { contains: 'Men' } },
        ];
      } else if (cat === 'women' || cat === 'femme') {
        where.OR = [
          { category: { slug: 'women' } },
          { category: { slug: 'floral' } },
          { description: { contains: 'Femme' } },
          { description: { contains: 'Women' } },
          { name: { contains: 'Femme' } },
          { name: { contains: 'Women' } },
        ];
      } else {
        where.OR = [
          { category: { slug: String(category) } },
          { category_id: String(category) },
        ];
      }
    }

    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: term } },
            { brand: { contains: term } },
            { description: { contains: term } },
            { top_notes: { contains: term } },
            { heart_notes: { contains: term } },
            { base_notes: { contains: term } },
          ],
        },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }

    if (volume && volume !== 'all') {
      where.volume_ml = parseInt(String(volume), 10);
    }

    let orderBy: any = { created_at: 'desc' };
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name') {
      orderBy = { name: 'asc' };
    } else if (sort === 'newest') {
      orderBy = { created_at: 'desc' };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });

    res.status(200).json({ products, total: products.length });
  } catch (error: any) {
    console.error('getProducts error:', error);
    res.status(500).json({ message: 'Error retrieving perfumes catalog.' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      res.status(404).json({ message: 'Perfume not found.' });
      return;
    }

    // Get related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        category_id: product.category_id,
        NOT: { id: product.id },
      },
      take: 4,
      include: { category: true },
    });

    res.status(200).json({ product, relatedProducts });
  } catch (error: any) {
    console.error('getProductById error:', error);
    res.status(500).json({ message: 'Error fetching perfume details.' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      brand,
      description,
      price,
      stock_quantity,
      volume_ml,
      top_notes,
      heart_notes,
      base_notes,
      image_url,
      category_id,
    } = req.body;

    if (!name || !brand || !description || price === undefined || !category_id) {
      res.status(400).json({ message: 'Missing required perfume fields.' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        brand: String(brand).trim(),
        description: String(description).trim(),
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity || 0, 10),
        volume_ml: parseInt(volume_ml || 100, 10),
        top_notes: String(top_notes || '').trim(),
        heart_notes: String(heart_notes || '').trim(),
        base_notes: String(base_notes || '').trim(),
        image_url: String(image_url || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80').trim(),
        category_id: String(category_id),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({ message: 'Perfume added successfully.', product });
  } catch (error: any) {
    console.error('createProduct error:', error);
    res.status(500).json({ message: 'Error adding new perfume.' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      name,
      brand,
      description,
      price,
      stock_quantity,
      volume_ml,
      top_notes,
      heart_notes,
      base_notes,
      image_url,
      category_id,
    } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Perfume not found.' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name: String(name).trim() }),
        ...(brand && { brand: String(brand).trim() }),
        ...(description && { description: String(description).trim() }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock_quantity !== undefined && { stock_quantity: parseInt(stock_quantity, 10) }),
        ...(volume_ml !== undefined && { volume_ml: parseInt(volume_ml, 10) }),
        ...(top_notes !== undefined && { top_notes: String(top_notes).trim() }),
        ...(heart_notes !== undefined && { heart_notes: String(heart_notes).trim() }),
        ...(base_notes !== undefined && { base_notes: String(base_notes).trim() }),
        ...(image_url && { image_url: String(image_url).trim() }),
        ...(category_id && { category_id: String(category_id) }),
      },
      include: {
        category: true,
      },
    });

    res.status(200).json({ message: 'Perfume updated successfully.', product: updated });
  } catch (error: any) {
    console.error('updateProduct error:', error);
    res.status(500).json({ message: 'Error updating perfume.' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ message: 'Perfume not found.' });
      return;
    }

    const orderItemsCount = await prisma.orderItem.count({
      where: { product_id: id },
    });

    if (orderItemsCount > 0) {
      res.status(400).json({
        message: 'Cannot delete product that is associated with existing customer orders. Consider setting its stock to 0 instead.',
      });
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Perfume removed successfully.' });
  } catch (error: any) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ message: 'Error deleting perfume.' });
  }
};
