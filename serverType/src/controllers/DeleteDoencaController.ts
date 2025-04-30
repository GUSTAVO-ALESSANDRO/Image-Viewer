// src/controllers/DeleteDoencaController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prismaClient";

export class DeleteDoencaController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    try {
      await prismaClient.doencas.delete({
        where: { id: parseInt(id) }
      });
      reply.status(200).send({ message: "Doença deletada com sucesso." });
    } catch (error) {
      reply.status(500).send({ error: "Erro ao deletar doença." });
    }
  }
}
