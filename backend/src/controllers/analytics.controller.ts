import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getAnalytics = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [
      totalProducts,
      totalOrders,
      registeredUsers,
      orders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.order.findMany({
        where: { status: { not: 'cancelled' } },
        select: { total_amount: true, created_at: true, status: true },
      }),
      prisma.product.findMany({
        where: { stock_quantity: { lte: 5 } },
        orderBy: { stock_quantity: 'asc' },
        take: 8,
        include: { category: true },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    // Group sales by day/status for charts
    const statusCounts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    const allOrdersForStatus = await prisma.order.findMany({
      select: { status: true },
    });
    allOrdersForStatus.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    // Top selling items
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: {
          select: { id: true, name: true, brand: true, price: true, image_url: true },
        },
      },
    });

    const salesByProduct: Record<
      string,
      { product: any; unitsSold: number; totalSales: number }
    > = {};

    orderItems.forEach((item) => {
      if (!salesByProduct[item.product_id]) {
        salesByProduct[item.product_id] = {
          product: item.product,
          unitsSold: 0,
          totalSales: 0,
        };
      }
      salesByProduct[item.product_id].unitsSold += item.quantity;
      salesByProduct[item.product_id].totalSales += item.price_at_purchase * item.quantity;
    });

    const topSellingProducts = Object.values(salesByProduct)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });

    res.status(200).json({
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        registeredUsers,
        lowStockCount: lowStockProducts.length,
      },
      statusDistribution: statusCounts,
      topSellingProducts,
      lowStockProducts,
      recentOrders,
    });
  } catch (error: any) {
    console.error('getAnalytics error:', error);
    res.status(500).json({ message: 'Error retrieving analytics data.' });
  }
};
