import prisma from '../configs/database.js';
import {
  parsePaginationParams,
  toPrismaQuery,
  createPaginatedResult,
} from '../utils/pagination.js';
import type { PaginationParams } from '../types/index.js';

interface StatisticsPeriod {
  year?: number;
  month?: number;
  day?: number;
}

class DashboardService {
  /**
   * Get organizer dashboard summary
   */
  async getOrganizerSummary(organizerId: string) {
    const now = new Date();

    const [
      totalEvents,
      activeEvents,
      completedEvents,
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      totalRevenue,
      totalAttendees,
    ] = await Promise.all([
      // Total events
      prisma.event.count({
        where: { organizerId },
      }),

      // Active events (published and not ended)
      prisma.event.count({
        where: {
          organizerId,
          status: 'PUBLISHED',
          endDate: { gt: now },
        },
      }),

      // Completed events
      prisma.event.count({
        where: {
          organizerId,
          status: 'COMPLETED',
        },
      }),

      // Total transactions
      prisma.transaction.count({
        where: { event: { organizerId } },
      }),

      // Completed transactions
      prisma.transaction.count({
        where: {
          event: { organizerId },
          status: 'COMPLETED',
        },
      }),

      // Pending transactions
      prisma.transaction.count({
        where: {
          event: { organizerId },
          status: 'WAITING_CONFIRMATION',
        },
      }),

      // Total revenue
      prisma.transaction.aggregate({
        where: {
          event: { organizerId },
          status: 'COMPLETED',
        },
        _sum: { finalAmount: true },
      }),

      // Total attendees (sum of tickets sold in completed transactions)
      prisma.transactionItem.aggregate({
        where: {
          transaction: {
            event: { organizerId },
            status: 'COMPLETED',
          },
        },
        _sum: { quantity: true },
      }),
    ]);

    // Get average rating
    const avgRating = await prisma.review.aggregate({
      where: { event: { organizerId } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      events: {
        total: totalEvents,
        active: activeEvents,
        completed: completedEvents,
      },
      transactions: {
        total: totalTransactions,
        completed: completedTransactions,
        pending: pendingTransactions,
      },
      revenue: totalRevenue._sum.finalAmount ?? 0,
      attendees: totalAttendees._sum.quantity ?? 0,
      rating: {
        average: avgRating._avg.rating ?? 0,
        total: avgRating._count.rating,
      },
    };
  }

  /**
   * Get event statistics over time
   */
  async getEventStatistics(organizerId: string, period: StatisticsPeriod) {
    const { year, month } = period;

    // Build date range
    let startDate: Date;
    let endDate: Date;
    let groupBy: 'day' | 'month' | 'year';

    if (year && month) {
      // Specific month - group by day
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
      groupBy = 'day';
    } else if (year) {
      // Specific year - group by month
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
      groupBy = 'month';
    } else {
      // All time - group by year
      startDate = new Date(2020, 0, 1);
      endDate = new Date();
      groupBy = 'year';
    }

    // Get transactions in the period
    const transactions = await prisma.transaction.findMany({
      where: {
        event: { organizerId },
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        finalAmount: true,
        createdAt: true,
        items: {
          select: { quantity: true },
        },
      },
    });

    // Group data
    const groupedData: Map<
      string,
      { revenue: number; tickets: number; transactions: number }
    > = new Map();

    for (const transaction of transactions) {
      let key: string;

      if (groupBy === 'day') {
        key = transaction.createdAt.getDate().toString();
      } else if (groupBy === 'month') {
        key = (transaction.createdAt.getMonth() + 1).toString();
      } else {
        key = transaction.createdAt.getFullYear().toString();
      }

      const existing = groupedData.get(key) || {
        revenue: 0,
        tickets: 0,
        transactions: 0,
      };
      existing.revenue += transaction.finalAmount;
      existing.tickets += transaction.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      existing.transactions += 1;
      groupedData.set(key, existing);
    }

    // Convert to array
    const data = Array.from(groupedData.entries()).map(([period, values]) => ({
      period,
      ...values,
    }));

    // Sort by period
    data.sort((a, b) => parseInt(a.period) - parseInt(b.period));

    return {
      groupBy,
      startDate,
      endDate,
      data,
      totals: {
        revenue: data.reduce((sum, d) => sum + d.revenue, 0),
        tickets: data.reduce((sum, d) => sum + d.tickets, 0),
        transactions: data.reduce((sum, d) => sum + d.transactions, 0),
      },
    };
  }

  /**
   * Get event participants list
   */
  async getEventParticipants(
    eventId: string,
    organizerId: string,
    pagination: PaginationParams
  ) {
    // Verify event belongs to organizer
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizerId },
    });

    if (!event) {
      return null;
    }

    const paginationOptions = parsePaginationParams(pagination);
    const { skip, take, orderBy } = toPrismaQuery(paginationOptions);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          eventId,
          status: 'COMPLETED',
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true,
            },
          },
          items: {
            include: {
              ticketTier: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.transaction.count({
        where: {
          eventId,
          status: 'COMPLETED',
        },
      }),
    ]);

    // Transform to participant list
    const participants = transactions.map((t) => ({
      userId: t.user.id,
      name: `${t.user.firstName} ${t.user.lastName}`,
      email: t.user.email,
      profileImage: t.user.profileImage,
      invoiceNumber: t.invoiceNumber,
      tickets: t.items.map((item) => ({
        tierName: item.ticketTier.name,
        quantity: item.quantity,
        unitPrice: item.ticketTier.price,
        subtotal: item.subtotal,
      })),
      totalTickets: t.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPaid: t.finalAmount,
      purchasedAt: t.confirmedAt || t.createdAt,
    }));

    return createPaginatedResult(participants, total, paginationOptions);
  }

  /**
   * Get organizer's pending transactions
   */
  async getPendingTransactions(
    organizerId: string,
    pagination: PaginationParams
  ) {
    const paginationOptions = parsePaginationParams(pagination);
    const { skip, take } = toPrismaQuery(paginationOptions);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          event: { organizerId },
          status: 'WAITING_CONFIRMATION',
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
            },
          },
          items: {
            include: {
              ticketTier: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' }, // Oldest first
        skip,
        take,
      }),
      prisma.transaction.count({
        where: {
          event: { organizerId },
          status: 'WAITING_CONFIRMATION',
        },
      }),
    ]);

    return createPaginatedResult(transactions, total, paginationOptions);
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(organizerId: string, limit: number = 10) {
    const [recentTransactions, recentReviews] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          event: { organizerId },
          status: { in: ['COMPLETED', 'WAITING_CONFIRMATION'] },
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          event: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.review.findMany({
        where: {
          event: { organizerId },
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          event: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    ]);

    // Combine and sort by date
    const activities = [
      ...recentTransactions.map((t) => ({
        type: 'transaction' as const,
        id: t.id,
        message: `${t.user.firstName} ${t.user.lastName} ${
          t.status === 'COMPLETED' ? 'menyelesaikan' : 'membuat'
        } transaksi untuk ${t.event.name}`,
        amount: t.finalAmount,
        status: t.status,
        createdAt: t.createdAt,
      })),
      ...recentReviews.map((r) => ({
        type: 'review' as const,
        id: r.id,
        message: `${r.user.firstName} ${r.user.lastName} memberikan rating ${r.rating} untuk ${r.event.name}`,
        rating: r.rating,
        createdAt: r.createdAt,
      })),
    ];

    // Sort by date
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return activities.slice(0, limit);
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
