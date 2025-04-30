-- CreateTable
CREATE TABLE "doencas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "sintomas" TEXT NOT NULL,
    "links" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doencas_pkey" PRIMARY KEY ("id")
);
