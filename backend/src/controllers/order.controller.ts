import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

interface CheckoutItemInput {
  product_id: string;
  quantity: number;
}

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || null;

    const {
      items,
      shipping_address,
      customer_name,
      customer_phone,
      customer_city,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Order must contain at least one perfume.' });
      return;
    }

    if (!shipping_address || String(shipping_address).trim() === '') {
      res.status(400).json({ message: 'Shipping address is required.' });
      return;
    }

    // Run transaction to verify stock, calculate total, decrement stock and create records
    const order = await prisma.$transaction(async (tx) => {
      let total_amount = 0;
      const orderItemsToCreate: Array<{
        product_id: string;
        quantity: number;
        price_at_purchase: number;
      }> = [];

      for (const item of items as CheckoutItemInput[]) {
        const product = await tx.product.findUnique({
          where: { id: item.product_id },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.product_id} was not found.`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
        }

        // Deduct stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock_quantity: product.stock_quantity - item.quantity,
          },
        });

        const itemTotal = product.price * item.quantity;
        total_amount += itemTotal;

        orderItemsToCreate.push({
          product_id: product.id,
          quantity: item.quantity,
          price_at_purchase: product.price,
        });
      }

      // Create Order (supports authenticated user or guest)
      const newOrder = await tx.order.create({
        data: {
          user_id: userId,
          customer_name: customer_name ? String(customer_name).trim() : null,
          customer_phone: customer_phone ? String(customer_phone).trim() : null,
          customer_city: customer_city ? String(customer_city).trim() : null,
          total_amount: Math.round(total_amount * 100) / 100,
          status: 'pending',
          shipping_address: String(shipping_address).trim(),
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return newOrder;
    });

    res.status(201).json({
      message: 'Order created successfully.',
      order,
    });
  } catch (error: any) {
    console.error('createOrder error:', error);
    res.status(400).json({ message: error.message || 'Error processing order.' });
  }
};

export const getUserOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                image_url: true,
                volume_ml: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({ orders });
  } catch (error: any) {
    console.error('getUserOrders error:', error);
    res.status(500).json({ message: 'Error retrieving user orders.' });
  }
};

export const getAllOrdersAdmin = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                image_url: true,
                volume_ml: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({ orders });
  } catch (error: any) {
    console.error('getAllOrdersAdmin error:', error);
    res.status(500).json({ message: 'Error retrieving admin orders.' });
  }
};

export const updateOrderStatusAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, email: true },
        },
        items: {
          include: { product: true },
        },
      },
    });

    res.status(200).json({ message: 'Order status updated successfully.', order: updated });
  } catch (error: any) {
    console.error('updateOrderStatusAdmin error:', error);
    res.status(500).json({ message: 'Error updating order status.' });
  }
};
