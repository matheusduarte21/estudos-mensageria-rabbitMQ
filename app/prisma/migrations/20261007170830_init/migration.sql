-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('CREATED', 'PAYMENT_PENDING', 'PAID', 'PAYMENT_FAILED', 'STOCK_RESERVED', 'OUT_OF_STOCK', 'READY_TO_SHIP', 'SHIPPED', 'PEDING');

-- CreateTable
CREATE TABLE "PedidoItem" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "produto" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "cliente" TEXT NOT NULL,
    "StatusPedido" "StatusPedido" NOT NULL DEFAULT 'PEDING',
    "dataEntrega" TIMESTAMP(3) NOT NULL,
    "enderecoEntrega" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
