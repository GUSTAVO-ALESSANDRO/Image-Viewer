// src/controllers/GetByIdDoencaController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prismaClient";

export class GetByIdDoencaController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    try {
      const doenca = await prismaClient.doencas.findUnique({
        where: { id: parseInt(id) }
      });
      if (!doenca) {
        return reply.status(404).send({ error: "Doença não encontrada." });
      }
      reply.send(doenca);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao buscar doença pelo ID." });
    }
  }
}
