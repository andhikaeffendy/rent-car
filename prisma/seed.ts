import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Simple placeholder SVG as data URI - no external URLs
function carPlaceholder(name: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="${color}"/>
  <text x="300" y="180" text-anchor="middle" fill="white" font-size="48" font-family="sans-serif" font-weight="bold">${name}</text>
  <text x="300" y="230" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="20" font-family="sans-serif">Agil Rental Mobil</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function main() {
  console.log("🌱 Seeding database Agil Rental Mobil...\n");

  // ── Clean ────────────────────────────────────────────
  await prisma.document.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rentalSetting.deleteMany();

  // ── USERS ────────────────────────────────────────────
  const hash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Priscil Admin",
      email: "admin@agilrental.test",
      password: hash,
      phone: "0857-5465-0271",
      role: "ADMIN",
    },
  });

  const customers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Budi Santoso",
        email: "budi@example.com",
        password: hash,
        phone: "0812-3456-7891",
        role: "CUSTOMER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Siti Rahayu",
        email: "siti@example.com",
        password: hash,
        phone: "0812-3456-7892",
        role: "CUSTOMER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Andi Pratama",
        email: "andi@example.com",
        password: hash,
        phone: "0812-3456-7893",
        role: "CUSTOMER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Dewi Lestari",
        email: "dewi@example.com",
        password: hash,
        phone: "0812-3456-7894",
        role: "CUSTOMER",
      },
    }),
  ]);

  // Additional user accounts
  const avowAdmin = await prisma.user.create({
    data: {
      name: "Avow Admin",
      email: "avow@admin.com",
      password: hash,
      phone: "0857-5465-0271",
      role: "ADMIN",
    },
  });

  const avowUser = await prisma.user.create({
    data: {
      name: "Avow User",
      email: "avow@user.com",
      password: hash,
      phone: "0821-7911-7882",
      role: "CUSTOMER",
    },
  });

  console.log(`✅ ${1 + customers.length + 2} users created`);
  console.log(`   Admin: admin@agilrental.test / password123`);

  // ── CARS (Agil Rental Mobil fleet) ───────────────────
  const placeholder = (name: string, color: string) =>
    carPlaceholder(name, color);

  const cars = await Promise.all([
    prisma.car.create({
      data: {
        name: "Brio Terbaru",
        slug: "brio-terbaru",
        transmission: "AT",
        capacity: 5,
        fuelType: "Bensin",
        year: 2024,
        color: "Hitam",
        priceSelfDrive: 350000,
        priceWithDriver: null,
        imageUrl: placeholder("Brio Terbaru", "#1a1a2e"),
        galleryUrls: [
          placeholder("Brio Terbaru", "#16213e"),
          placeholder("Brio Terbaru", "#0f3460"),
        ],
        status: "AVAILABLE",
        description:
          "Honda Brio terbaru dengan transmisi matic, sangat irit bahan bakar dan lincah di perkotaan. Cocok untuk perjalanan harian di kota Ambon.",
        facilities: ["AC", "Audio Bluetooth", "Kunci Sentral", "Airbag", "Sabuk Pengaman"],
      },
    }),
    prisma.car.create({
      data: {
        name: "Xenia 2020",
        slug: "xenia-2020",
        transmission: "MT",
        capacity: 7,
        fuelType: "Bensin",
        year: 2020,
        color: "Silver",
        priceSelfDrive: 350000,
        priceWithDriver: 600000,
        imageUrl: placeholder("Xenia 2020", "#2d3436"),
        galleryUrls: [
          placeholder("Xenia 2020", "#636e72"),
          placeholder("Xenia 2020", "#b2bec3"),
        ],
        status: "AVAILABLE",
        description:
          "Daihatsu Xenia 2020 manual transmisi, kapasitas 7 kursi. Nyaman untuk keluarga. Tersedia dengan sopir.",
        facilities: ["AC", "Audio", "Kunci Sentral", "Bagasi Luas", "Ban Cadangan"],
      },
    }),
    prisma.car.create({
      data: {
        name: "Xenia Terbaru",
        slug: "xenia-terbaru",
        transmission: "MT",
        capacity: 7,
        fuelType: "Bensin",
        year: 2024,
        color: "Putih",
        priceSelfDrive: 400000,
        priceWithDriver: 600000,
        imageUrl: placeholder("Xenia Terbaru", "#6c5ce7"),
        galleryUrls: [
          placeholder("Xenia Terbaru", "#a29bfe"),
          placeholder("Xenia Terbaru", "#dfe6e9"),
        ],
        status: "AVAILABLE",
        description:
          "Daihatsu Xenia terbaru dengan desain modern dan kabin luas. Cocok untuk perjalanan keluarga di Ambon.",
        facilities: ["AC", "Audio Bluetooth", "Kunci Sentral", "Airbag", "Bagasi Luas", "USB Charger"],
      },
    }),
    prisma.car.create({
      data: {
        name: "Avanza Terbaru",
        slug: "avanza-terbaru",
        transmission: "AT",
        capacity: 7,
        fuelType: "Bensin",
        year: 2024,
        color: "Hitam",
        priceSelfDrive: 400000,
        priceWithDriver: 600000,
        imageUrl: placeholder("Avanza Terbaru", "#d63031"),
        galleryUrls: [
          placeholder("Avanza Terbaru", "#e17055"),
          placeholder("Avanza Terbaru", "#fab1a0"),
        ],
        status: "AVAILABLE",
        description:
          "Toyota Avanza terbaru transmisi matic, 7 kursi. Mobil keluarga paling populer di Indonesia. Tersedia dengan sopir.",
        facilities: ["AC", "Audio Bluetooth", "Kunci Sentral", "Airbag", "Bagasi Luas", "USB Charger", "Parkir Sensor"],
      },
    }),
    prisma.car.create({
      data: {
        name: "Innova Reborn",
        slug: "innova-reborn",
        transmission: "AT/MT",
        capacity: 7,
        fuelType: "Diesel",
        year: 2023,
        color: "Putih",
        priceSelfDrive: 700000,
        priceWithDriver: 900000,
        imageUrl: placeholder("Innova Reborn", "#00b894"),
        galleryUrls: [
          placeholder("Innova Reborn", "#55efc4"),
          placeholder("Innova Reborn", "#81ecec"),
        ],
        status: "AVAILABLE",
        description:
          "Toyota Kijang Innova Reborn, tersedia AT dan MT. Kabin mewah, nyaman untuk perjalanan jauh. Pilihan utama keluarga dan wisata.",
        facilities: ["AC Double Blower", "Audio Layar", "Kursi Kulit", "Airbag", "Bagasi Luas", "AC Belakang", "USB Charger"],
      },
    }),
    prisma.car.create({
      data: {
        name: "Zenix",
        slug: "zenix",
        transmission: "AT",
        capacity: 7,
        fuelType: "Bensin",
        year: 2024,
        color: "Abu-abu",
        priceSelfDrive: 900000,
        priceWithDriver: 1300000,
        imageUrl: placeholder("Zenix", "#0984e3"),
        galleryUrls: [
          placeholder("Zenix", "#74b9ff"),
          placeholder("Zenix", "#dfe6e9"),
        ],
        status: "AVAILABLE",
        description:
          "Toyota Zenix terbaru, transmisi matic. Mobil premium dengan kenyamanan maksimal. Tersedia dengan sopir berpengalaman.",
        facilities: ["AC Premium", "Audio Layar", "Kursi Kulit", "Sunroof", "Airbag", "Kamera Mundur", "Parkir Sensor", "USB Charger"],
      },
    }),
  ]);

  console.log(`✅ ${cars.length} cars created (Agil Rental Mobil fleet)`);

  // ── RENTAL SETTINGS ──────────────────────────────────
  await prisma.rentalSetting.create({
    data: {
      rentalName: "Agil Rental Mobil",
      address: "Jl. Dr. Malaihollo, Benteng, Ambon (depan Warung Padang Talago Intan)",
      openingHours: "Senin-Sabtu 08.00-21.00 WIT, Minggu 10.00-21.00 WIT",
      phone1: "0857-5465-0271",
      phone2: "0821-7911-7882",
      instagram: "@agil.rental.ambon",
      facebook: "Gilbert Sipahelut",
    },
  });

  console.log("✅ Rental settings created");

  // ── SAMPLE BOOKINGS ──────────────────────────────────
  const now = new Date();
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d;
  };

  const [brio, xenia2020, xeniaBaru, avanza, innova, zenix] = cars;
  const bookingCode = () => `AGL-${uuidv4().substring(0, 8).toUpperCase()}`;

  // Booking 1: Completed - Brio (tanpa user)
  const b1 = await prisma.booking.create({
    data: {
      bookingCode: bookingCode(),
      carId: brio.id,
      serviceType: "SELF_DRIVE",
      pickupMethod: "SELF_PICKUP",
      startDate: day(-10),
      endDate: day(-8),
      duration: 2,
      subtotal: brio.priceSelfDrive * 2,
      deliveryFee: 0,
      totalPrice: brio.priceSelfDrive * 2,
      status: "COMPLETED",
    },
  });
  await prisma.payment.create({
    data: {
      bookingId: b1.id,
      amount: b1.totalPrice,
      transferProofUrl: placeholder("Bukti Transfer", "#27ae60"),
      status: "VERIFIED",
      verifiedAt: day(-9),
    },
  });
  await prisma.document.create({
    data: {
      bookingId: b1.id,
      ktpUrl: placeholder("KTP", "#2980b9"),
    },
  });

  // Booking 2: WAITING_VERIFICATION - Avanza (user: Budi)
  const b2 = await prisma.booking.create({
    data: {
      bookingCode: bookingCode(),
      userId: customers[0].id,
      carId: avanza.id,
      serviceType: "WITH_DRIVER",
      pickupMethod: "DELIVERY",
      pickupAddress: "Jl. Pattimura No. 10, Ambon",
      startDate: day(3),
      endDate: day(5),
      duration: 2,
      subtotal: (avanza.priceWithDriver || 600000) * 2,
      deliveryFee: 50000,
      totalPrice: (avanza.priceWithDriver || 600000) * 2 + 50000,
      notes: "Tolong antar ke alamat pickup",
      status: "WAITING_VERIFICATION",
    },
  });
  await prisma.payment.create({
    data: {
      bookingId: b2.id,
      amount: b2.totalPrice,
      transferProofUrl: placeholder("Transfer Budi", "#f39c12"),
      status: "WAITING",
    },
  });
  await prisma.document.create({
    data: {
      bookingId: b2.id,
      ktpUrl: placeholder("KTP Budi", "#2980b9"),
    },
  });

  // Booking 3: CONFIRMED - Innova (user: Siti)
  const b3 = await prisma.booking.create({
    data: {
      bookingCode: bookingCode(),
      userId: customers[1].id,
      carId: innova.id,
      serviceType: "SELF_DRIVE",
      pickupMethod: "SELF_PICKUP",
      startDate: day(5),
      endDate: day(7),
      duration: 2,
      subtotal: innova.priceSelfDrive * 2,
      deliveryFee: 0,
      totalPrice: innova.priceSelfDrive * 2,
      notes: "Pengambilan jam 08.00 pagi",
      status: "CONFIRMED",
    },
  });
  await prisma.payment.create({
    data: {
      bookingId: b3.id,
      amount: b3.totalPrice,
      transferProofUrl: placeholder("Transfer Siti", "#27ae60"),
      status: "VERIFIED",
      verifiedAt: day(4),
    },
  });
  await prisma.document.create({
    data: {
      bookingId: b3.id,
      ktpUrl: placeholder("KTP Siti", "#2980b9"),
    },
  });

  // Booking 4: WAITING_PAYMENT - Zenix (user: Andi)
  await prisma.booking.create({
    data: {
      bookingCode: bookingCode(),
      userId: customers[2].id,
      carId: zenix.id,
      serviceType: "WITH_DRIVER",
      pickupMethod: "SELF_PICKUP",
      startDate: day(7),
      endDate: day(8),
      duration: 1,
      subtotal: zenix.priceWithDriver || 1300000,
      deliveryFee: 0,
      totalPrice: zenix.priceWithDriver || 1300000,
      status: "WAITING_PAYMENT",
    },
  });

  // Booking 5: CANCELLED - Xenia 2020 (user: Dewi)
  await prisma.booking.create({
    data: {
      bookingCode: bookingCode(),
      userId: customers[3].id,
      carId: xenia2020.id,
      serviceType: "SELF_DRIVE",
      pickupMethod: "SELF_PICKUP",
      startDate: day(-2),
      endDate: day(0),
      duration: 2,
      subtotal: xenia2020.priceSelfDrive * 2,
      deliveryFee: 0,
      totalPrice: xenia2020.priceSelfDrive * 2,
      status: "CANCELLED",
    },
  });

  console.log("✅ 5 sample bookings created with payments & documents");
  console.log("\n" + "=".repeat(50));
  console.log("   ✅ SEED COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(50));
  console.log(`   👤 ${1 + customers.length + 2} users`);
  console.log(`   🚙 ${cars.length} cars`);
  console.log(`   📋 5 bookings`);
  console.log(`   ⚙️  1 rental setting`);
  console.log("=".repeat(50));
  console.log("\n📧 Admin:    admin@agilrental.test / password123");
  console.log("📧 Admin:    avow@admin.com / password123");
  console.log("📧 Customer: budi@example.com / password123");
  console.log("📧 Customer: siti@example.com / password123");
  console.log("📧 Customer: andi@example.com / password123");
  console.log("📧 Customer: dewi@example.com / password123");
  console.log("📧 Customer: avow@user.com / password123");
  console.log("=".repeat(50));
  console.log("\n💡 Images use SVG placeholders. Upload real images via Admin Panel.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
