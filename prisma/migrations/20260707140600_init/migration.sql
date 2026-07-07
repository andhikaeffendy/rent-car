-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('WAITING_PAYMENT', 'WAITING_VERIFICATION', 'CONFIRMED', 'REJECTED', 'ON_RENT', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('WAITING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SELF_DRIVE', 'WITH_DRIVER');

-- CreateEnum
CREATE TYPE "PickupMethod" AS ENUM ('SELF_PICKUP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOBIL', 'MOTOR');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TRANSFER', 'TUNAI');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 4,
    "fuelType" TEXT NOT NULL DEFAULT 'Bensin',
    "type" "VehicleType" NOT NULL DEFAULT 'MOBIL',
    "year" INTEGER NOT NULL,
    "color" TEXT,
    "priceSelfDrive" DOUBLE PRECISION NOT NULL,
    "priceWithDriver" DOUBLE PRECISION,
    "imageUrl" TEXT NOT NULL,
    "galleryUrls" TEXT[],
    "status" "CarStatus" NOT NULL DEFAULT 'AVAILABLE',
    "description" TEXT,
    "facilities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "userId" TEXT,
    "carId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL DEFAULT 'SELF_DRIVE',
    "pickupMethod" "PickupMethod" NOT NULL DEFAULT 'SELF_PICKUP',
    "pickupAddress" TEXT,
    "deliveryPhone" TEXT,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'TRANSFER',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'WAITING_PAYMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transferProofUrl" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'WAITING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "ktpUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalSetting" (
    "id" TEXT NOT NULL,
    "rentalName" TEXT NOT NULL DEFAULT 'Agil Rental Mobil',
    "address" TEXT NOT NULL DEFAULT 'Jl. Dr. Malaihollo, Benteng, Ambon (depan Warung Padang Talago Intan)',
    "openingHours" TEXT NOT NULL DEFAULT 'Senin-Sabtu 08.00-21.00 WIT, Minggu 10.00-21.00 WIT',
    "phone1" TEXT NOT NULL DEFAULT '0857-5465-0271',
    "phone2" TEXT NOT NULL DEFAULT '0821-7911-7882',
    "instagram" TEXT NOT NULL DEFAULT '@agil.rental.ambon',
    "facebook" TEXT NOT NULL DEFAULT 'Gilbert Sipahelut',
    "logoUrl" TEXT,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "bankAccountName" TEXT,

    CONSTRAINT "RentalSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingCode_key" ON "Booking"("bookingCode");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

