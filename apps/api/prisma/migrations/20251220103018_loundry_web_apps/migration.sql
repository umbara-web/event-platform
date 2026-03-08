-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'SUPER_ADMIN', 'OUTLET_ADMIN', 'WORKER', 'DRIVER');

-- CreateEnum
CREATE TYPE "Worker_Type" AS ENUM ('WASHING', 'IRONING', 'PACKING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "phone" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outlet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "long" TEXT NOT NULL,

    CONSTRAINT "Outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "outlet_id" TEXT NOT NULL,
    "worker_type" "Worker_Type" NOT NULL DEFAULT 'WASHING',

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "outlet_id" TEXT NOT NULL,
    "driver_pickup_id" TEXT NOT NULL,
    "driver_delivery_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "total_weight" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "payment_status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_Item" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "qty_initial" INTEGER NOT NULL,
    "qty_washing" INTEGER NOT NULL,
    "qty_ironing" INTEGER NOT NULL,
    "qty_packing" INTEGER NOT NULL,

    CONSTRAINT "Order_Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bypass_Log" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "outlet_admin_id" TEXT NOT NULL,
    "station" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bypass_Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_user_id_key" ON "Worker"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_outlet_id_key" ON "Worker"("outlet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_customer_id_key" ON "Order"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_outlet_id_key" ON "Order"("outlet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_driver_pickup_id_key" ON "Order"("driver_pickup_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_driver_delivery_id_key" ON "Order"("driver_delivery_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_Item_order_id_key" ON "Order_Item"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_Item_item_name_key" ON "Order_Item"("item_name");

-- CreateIndex
CREATE UNIQUE INDEX "Bypass_Log_order_id_key" ON "Bypass_Log"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bypass_Log_outlet_admin_id_key" ON "Bypass_Log"("outlet_admin_id");
