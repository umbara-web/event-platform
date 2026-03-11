import {
  PrismaClient,
  Role,
  EventStatus,
  TicketType,
  DiscountType,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.transactionPoint.deleteMany();
  await prisma.transactionCoupon.deleteMany();
  await prisma.transactionVoucher.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.review.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.ticketTier.deleteMany();
  await prisma.event.deleteMany();
  await prisma.userCoupon.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.point.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.location.deleteMany();

  // Create Categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Musik',
        slug: 'musik',
        description: 'Konser dan festival musik',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Olahraga',
        slug: 'olahraga',
        description: 'Event olahraga dan kompetisi',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Teknologi',
        slug: 'teknologi',
        description: 'Konferensi dan workshop teknologi',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Seni & Budaya',
        slug: 'seni-budaya',
        description: 'Pameran seni dan pertunjukan budaya',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bisnis',
        slug: 'bisnis',
        description: 'Seminar dan networking bisnis',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Edukasi',
        slug: 'edukasi',
        description: 'Workshop dan kursus pembelajaran',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Food & Drink',
        slug: 'food-drink',
        description: 'Festival kuliner dan wine tasting',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Kesehatan',
        slug: 'kesehatan',
        description: 'Seminar kesehatan dan wellness',
      },
    }),
  ]);

  // Create Locations
  console.log('Creating locations...');
  const locations = await Promise.all([
    prisma.location.create({
      data: { name: 'Jakarta', slug: 'jakarta', province: 'DKI Jakarta' },
    }),
    prisma.location.create({
      data: { name: 'Bandung', slug: 'bandung', province: 'Jawa Barat' },
    }),
    prisma.location.create({
      data: { name: 'Surabaya', slug: 'surabaya', province: 'Jawa Timur' },
    }),
    prisma.location.create({
      data: {
        name: 'Yogyakarta',
        slug: 'yogyakarta',
        province: 'DI Yogyakarta',
      },
    }),
    prisma.location.create({
      data: { name: 'Bali', slug: 'bali', province: 'Bali' },
    }),
    prisma.location.create({
      data: { name: 'Medan', slug: 'medan', province: 'Sumatera Utara' },
    }),
    prisma.location.create({
      data: { name: 'Semarang', slug: 'semarang', province: 'Jawa Tengah' },
    }),
    prisma.location.create({
      data: {
        name: 'Makassar',
        slug: 'makassar',
        province: 'Sulawesi Selatan',
      },
    }),
  ]);

  // Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('Password123', 12);

  const organizer1 = await prisma.user.create({
    data: {
      email: 'organizer@example.com',
      password: hashedPassword,
      firstName: 'Event',
      lastName: 'Organizer',
      role: Role.ORGANIZER,
      referralCode: 'REF-ORG00001',
      isVerified: true,
    },
  });

  const organizer2 = await prisma.user.create({
    data: {
      email: 'organizer2@example.com',
      password: hashedPassword,
      firstName: 'Music',
      lastName: 'Producer',
      role: Role.ORGANIZER,
      referralCode: 'REF-ORG00002',
      isVerified: true,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Customer',
      role: Role.CUSTOMER,
      referralCode: 'REF-CUS00001',
      isVerified: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      role: Role.CUSTOMER,
      referralCode: 'REF-CUS00002',
      referredById: customer1.id,
      isVerified: true,
    },
  });

  // Give referral points to customer1
  await prisma.point.create({
    data: {
      userId: customer1.id,
      amount: 10000,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      source: 'REFERRAL',
    },
  });

  // Create system coupon
  const systemCoupon = await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minPurchase: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      isSystemGenerated: true,
    },
  });

  // Give coupon to customer2
  await prisma.userCoupon.create({
    data: {
      userId: customer2.id,
      couponId: systemCoupon.id,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  // Helper function for future dates
  const now = new Date();
  const futureDate = (days: number) =>
    new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const pastDate = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Create Events
  console.log('Creating events...');

  // Event 1: Jakarta Music Festival
  const event1 = await prisma.event.create({
    data: {
      organizerId: organizer1.id,
      categoryId: categories[0]!.id,
      locationId: locations[0]!.id,
      name: 'Jakarta Music Festival 2025',
      slug: 'jakarta-music-festival-2025-abc12345',
      description:
        'Festival musik terbesar di Jakarta dengan berbagai genre musik dari artis lokal dan internasional. Nikmati pengalaman musik yang tak terlupakan bersama ribuan penggemar musik lainnya.',
      venue: 'Gelora Bung Karno',
      address: 'Jl. Pintu Satu Senayan, Jakarta Pusat 10270',
      imageUrl:
        '<https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800>',
      startDate: futureDate(30),
      endDate: futureDate(31),
      status: EventStatus.PUBLISHED,
      ticketTypes: {
        create: [
          {
            name: 'Regular',
            description: 'Akses area regular',
            price: 250000,
            ticketType: TicketType.PAID,
            quota: 5000,
            maxPerUser: 5,
            salesStartDate: now,
            salesEndDate: futureDate(29),
          },
          {
            name: 'VIP',
            description: 'Akses area VIP dengan fasilitas eksklusif',
            price: 750000,
            ticketType: TicketType.PAID,
            quota: 1000,
            maxPerUser: 3,
            salesStartDate: now,
            salesEndDate: futureDate(29),
          },
          {
            name: 'VVIP',
            description: 'Akses backstage dan meet & greet dengan artis',
            price: 1500000,
            ticketType: TicketType.PAID,
            quota: 200,
            maxPerUser: 2,
            salesStartDate: now,
            salesEndDate: futureDate(29),
          },
        ],
      },
    },
  });

  // Event 2: Tech Conference
  const event2 = await prisma.event.create({
    data: {
      organizerId: organizer1.id,
      categoryId: categories[2]!.id,
      locationId: locations[1]!.id,
      name: 'Indonesia Tech Summit 2025',
      slug: 'indonesia-tech-summit-2025-def67890',
      description:
        'Konferensi teknologi terbesar di Indonesia. Pelajari tren terbaru dalam AI, blockchain, cloud computing, dan teknologi masa depan dari para ahli industri.',
      venue: 'Trans Convention Centre',
      address: 'Jl. Gatot Subroto No.289, Bandung',
      imageUrl:
        '<https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800>',
      startDate: futureDate(45),
      endDate: futureDate(46),
      status: EventStatus.PUBLISHED,
      ticketTypes: {
        create: [
          {
            name: 'Early Bird',
            description: 'Akses konferensi 2 hari',
            price: 500000,
            ticketType: TicketType.PAID,
            quota: 500,
            maxPerUser: 2,
            salesStartDate: now,
            salesEndDate: futureDate(20),
          },
          {
            name: 'Regular',
            description: 'Akses konferensi 2 hari',
            price: 750000,
            ticketType: TicketType.PAID,
            quota: 1000,
            maxPerUser: 5,
            salesStartDate: futureDate(21),
            salesEndDate: futureDate(44),
          },
          {
            name: 'Workshop Pass',
            description: 'Akses konferensi + workshop hands-on',
            price: 1200000,
            ticketType: TicketType.PAID,
            quota: 200,
            maxPerUser: 2,
            salesStartDate: now,
            salesEndDate: futureDate(44),
          },
        ],
      },
    },
  });

  // Event 3: Free Webinar
  const event3 = await prisma.event.create({
    data: {
      organizerId: organizer2.id,
      categoryId: categories[5]!.id,
      locationId: locations[0]!.id,
      name: 'Webinar: Memulai Karir di Tech Industry',
      slug: 'webinar-karir-tech-industry-ghi11111',
      description:
        'Webinar gratis tentang cara memulai karir di industri teknologi. Cocok untuk fresh graduate dan career switcher.',
      venue: 'Online (Zoom)',
      address: 'Virtual Event',
      imageUrl:
        '<https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800>',
      startDate: futureDate(7),
      endDate: futureDate(7),
      status: EventStatus.PUBLISHED,
      ticketTypes: {
        create: [
          {
            name: 'Free Access',
            description: 'Akses webinar + recording',
            price: 0,
            ticketType: TicketType.FREE,
            quota: 1000,
            maxPerUser: 1,
            salesStartDate: now,
            salesEndDate: futureDate(6),
          },
        ],
      },
    },
  });

  // Event 4: Food Festival
  const event4 = await prisma.event.create({
    data: {
      organizerId: organizer1.id,
      categoryId: categories[6]!.id,
      locationId: locations[4]!.id,
      name: 'Bali Food Festival 2025',
      slug: 'bali-food-festival-2025-jkl22222',
      description:
        'Festival kuliner terbesar di Bali! Nikmati ratusan jenis makanan dan minuman dari seluruh Indonesia dan mancanegara.',
      venue: 'Bali Collection',
      address: 'BTDC Area, Nusa Dua, Bali',
      imageUrl:
        '<https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800>',
      startDate: futureDate(60),
      endDate: futureDate(62),
      status: EventStatus.PUBLISHED,
      ticketTypes: {
        create: [
          {
            name: 'Day Pass',
            description: 'Akses 1 hari',
            price: 100000,
            ticketType: TicketType.PAID,
            quota: 3000,
            maxPerUser: 10,
            salesStartDate: now,
            salesEndDate: futureDate(59),
          },
          {
            name: '3-Day Pass',
            description: 'Akses 3 hari penuh',
            price: 250000,
            ticketType: TicketType.PAID,
            quota: 1500,
            maxPerUser: 5,
            salesStartDate: now,
            salesEndDate: futureDate(59),
          },
          {
            name: 'VIP All-Inclusive',
            description: 'Akses 3 hari + voucher makan Rp500.000',
            price: 500000,
            ticketType: TicketType.PAID,
            quota: 500,
            maxPerUser: 3,
            salesStartDate: now,
            salesEndDate: futureDate(59),
          },
        ],
      },
    },
  });

  // Event 5: Marathon (Sports)
  const event5 = await prisma.event.create({
    data: {
      organizerId: organizer2.id,
      categoryId: categories[1]!.id,
      locationId: locations[2]!.id,
      name: 'Surabaya Marathon 2025',
      slug: 'surabaya-marathon-2025-mno33333',
      description:
        'Ikuti maraton terbesar di Jawa Timur! Tersedia kategori 5K, 10K, 21K, dan 42K. Semua peserta mendapat medali finisher dan jersey eksklusif.',
      venue: 'Tugu Pahlawan',
      address: 'Jl. Pahlawan, Surabaya',
      imageUrl:
        '<https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800>',
      startDate: futureDate(90),
      endDate: futureDate(90),
      status: EventStatus.PUBLISHED,
      ticketTypes: {
        create: [
          {
            name: '5K Fun Run',
            description: 'Kategori 5 kilometer',
            price: 150000,
            ticketType: TicketType.PAID,
            quota: 2000,
            maxPerUser: 5,
            salesStartDate: now,
            salesEndDate: futureDate(85),
          },
          {
            name: '10K',
            description: 'Kategori 10 kilometer',
            price: 250000,
            ticketType: TicketType.PAID,
            quota: 1500,
            maxPerUser: 3,
            salesStartDate: now,
            salesEndDate: futureDate(85),
          },
          {
            name: 'Half Marathon (21K)',
            description: 'Kategori 21 kilometer',
            price: 400000,
            ticketType: TicketType.PAID,
            quota: 1000,
            maxPerUser: 2,
            salesStartDate: now,
            salesEndDate: futureDate(85),
          },
          {
            name: 'Full Marathon (42K)',
            description: 'Kategori 42 kilometer',
            price: 600000,
            ticketType: TicketType.PAID,
            quota: 500,
            maxPerUser: 1,
            salesStartDate: now,
            salesEndDate: futureDate(85),
          },
        ],
      },
    },
  });

  // Event 6: Art Exhibition
  const event6 = await prisma.event.create({
    data: {
      organizerId: organizer1.id,
      categoryId: categories[3]!.id,
      locationId: locations[3]!.id,
      name: 'Contemporary Art Exhibition Yogyakarta',
      slug: 'contemporary-art-exhibition-yogya-pqr44444',
      description:
        'Pameran seni kontemporer menampilkan karya dari 50+ seniman Indonesia dan internasional. Jelajahi berbagai medium seni dari lukisan, patung, instalasi, hingga digital art.',
      venue: 'Museum Affandi',
      address: 'Jl. Laksda Adisucipto 167, Yogyakarta',
      imageUrl:
        '<https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800>',
      startDate: futureDate(15),
      endDate: futureDate(45),
      status: EventStatus.PUBLISHED,
      ticketTypes: {
        create: [
          {
            name: 'Regular Entry',
            description: 'Akses pameran reguler',
            price: 50000,
            ticketType: TicketType.PAID,
            quota: 5000,
            maxPerUser: 10,
            salesStartDate: now,
            salesEndDate: futureDate(44),
          },
          {
            name: 'Guided Tour',
            description: 'Akses pameran + tur dengan kurator',
            price: 150000,
            ticketType: TicketType.PAID,
            quota: 500,
            maxPerUser: 5,
            salesStartDate: now,
            salesEndDate: futureDate(44),
          },
        ],
      },
    },
  });

  // Event 7: Past Event (for reviews)
  const event7 = await prisma.event.create({
    data: {
      organizerId: organizer1.id,
      categoryId: categories[0]!.id,
      locationId: locations[0]!.id,
      name: 'Jakarta Jazz Festival 2024',
      slug: 'jakarta-jazz-festival-2024-stu55555',
      description:
        'Festival jazz tahunan dengan line-up artis jazz internasional dan lokal terbaik.',
      venue: 'JIExpo Kemayoran',
      address: 'Jl. Benyamin Suaeb, Jakarta Pusat',
      imageUrl:
        '<https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800>',
      startDate: pastDate(30),
      endDate: pastDate(28),
      status: EventStatus.COMPLETED,
      ticketTypes: {
        create: [
          {
            name: 'Regular',
            price: 350000,
            ticketType: TicketType.PAID,
            quota: 5000,
            soldCount: 4500,
            maxPerUser: 5,
            salesStartDate: pastDate(90),
            salesEndDate: pastDate(31),
          },
          {
            name: 'VIP',
            price: 1000000,
            ticketType: TicketType.PAID,
            quota: 1000,
            soldCount: 950,
            maxPerUser: 3,
            salesStartDate: pastDate(90),
            salesEndDate: pastDate(31),
          },
        ],
      },
    },
  });

  // Create Vouchers
  console.log('Creating vouchers...');
  await prisma.voucher.create({
    data: {
      eventId: event1.id,
      code: 'JMF25-EARLY15',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      minPurchase: 250000,
      maxDiscount: 200000,
      usageLimit: 100,
      startDate: now,
      endDate: futureDate(15),
    },
  });

  await prisma.voucher.create({
    data: {
      eventId: event1.id,
      code: 'JMF25-50K',
      discountType: DiscountType.FIXED,
      discountValue: 50000,
      minPurchase: 500000,
      usageLimit: 50,
      startDate: now,
      endDate: futureDate(29),
    },
  });

  await prisma.voucher.create({
    data: {
      eventId: event2.id,
      code: 'TECH25-STUDENT',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 30,
      minPurchase: 0,
      maxDiscount: 300000,
      usageLimit: 200,
      startDate: now,
      endDate: futureDate(44),
    },
  });

  await prisma.voucher.create({
    data: {
      eventId: event4.id,
      code: 'BALIFOOD-100K',
      discountType: DiscountType.FIXED,
      discountValue: 100000,
      minPurchase: 200000,
      usageLimit: 100,
      startDate: now,
      endDate: futureDate(59),
    },
  });

  // Create completed transactions for past event (for reviews)
  console.log('Creating transactions and reviews...');

  const event7Tiers = await prisma.ticketTier.findMany({
    where: { eventId: event7.id },
  });

  // Transaction 1 (completed)
  const transaction1 = await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-20241101-ABC123',
      userId: customer1.id,
      eventId: event7.id,
      status: 'COMPLETED',
      totalAmount: 350000,
      discountAmount: 0,
      pointsUsed: 0,
      finalAmount: 350000,
      paidAt: pastDate(35),
      confirmedAt: pastDate(34),
      paymentDeadline: pastDate(35),
      confirmDeadline: pastDate(32),
      items: {
        create: [
          {
            ticketTierId: event7Tiers[0]!.id,
            quantity: 1,
            unitPrice: 350000,
            subtotal: 350000,
          },
        ],
      },
    },
  });

  // Transaction 2 (completed)
  const transaction2 = await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-20241102-DEF456',
      userId: customer2.id,
      eventId: event7.id,
      status: 'COMPLETED',
      totalAmount: 700000,
      discountAmount: 0,
      pointsUsed: 0,
      finalAmount: 700000,
      paidAt: pastDate(40),
      confirmedAt: pastDate(39),
      paymentDeadline: pastDate(40),
      confirmDeadline: pastDate(37),
      items: {
        create: [
          {
            ticketTierId: event7Tiers[0]!.id,
            quantity: 2,
            unitPrice: 350000,
            subtotal: 700000,
          },
        ],
      },
    },
  });

  // Create reviews for completed event
  await prisma.review.create({
    data: {
      userId: customer1.id,
      eventId: event7.id,
      rating: 5,
      comment:
        'Event yang luar biasa! Lineup artis sangat memuaskan dan sound systemnya perfect. Pasti akan datang lagi tahun depan!',
    },
  });

  await prisma.review.create({
    data: {
      userId: customer2.id,
      eventId: event7.id,
      rating: 4,
      comment:
        'Overall bagus, tapi antriannya agak panjang. Musiknya top notch!',
    },
  });

  // Create more sample users
  console.log('Creating additional users...');

  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: hashedPassword,
        firstName: `User`,
        lastName: `Sample${i}`,
        role: Role.CUSTOMER,
        referralCode: `REF-USR0000${i}`,
        isVerified: true,
      },
    });

    // Create completed transaction for each user
    await prisma.transaction.create({
      data: {
        invoiceNumber: `INV-20241103-USR${i}00`,
        userId: user.id,
        eventId: event7.id,
        status: 'COMPLETED',
        totalAmount: 350000,
        discountAmount: 0,
        pointsUsed: 0,
        finalAmount: 350000,
        paidAt: pastDate(35 + i),
        confirmedAt: pastDate(34 + i),
        paymentDeadline: pastDate(35 + i),
        confirmDeadline: pastDate(32 + i),
        items: {
          create: [
            {
              ticketTierId: event7Tiers[0]!.id,
              quantity: 1,
              unitPrice: 350000,
              subtotal: 350000,
            },
          ],
        },
      },
    });

    // Create review
    await prisma.review.create({
      data: {
        userId: user.id,
        eventId: event7.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
        comment: [
          'Eventnya sangat bagus dan terorganisir dengan baik!',
          'Pengalaman yang tidak terlupakan, sangat recommended!',
          'Lineup artistnya keren banget, worth the price!',
          'Venue nyaman dan mudah dijangkau, top!',
          'Sudah beberapa kali ikut, selalu memuaskan!',
        ][i - 1],
      },
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📋 Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Organizer:');
  console.log('  Email: organizer@example.com');
  console.log('  Password: Password123');
  console.log('');
  console.log('Customer (with referral points):');
  console.log('  Email: customer@example.com');
  console.log('  Password: Password123');
  console.log('  Referral Code: REF-CUS00001');
  console.log('');
  console.log('Customer (with welcome coupon):');
  console.log('  Email: customer2@example.com');
  console.log('  Password: Password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
