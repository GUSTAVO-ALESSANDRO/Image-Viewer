// src/controllers/UpdateDoencaController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prismaClient";

export class UpdateDoencaController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    const { titulo, descricao, author, sintomas, links } = request.body as {
      titulo: string;
      descricao: string;
      author: string;
      sintomas: string;
      links: any;
    };

    try {
      const updatedDoenca = await prismaClient.doencas.update({
        where: { id: parseInt(id) },
        data: { titulo, descricao, author, sintomas, links }
      });
      reply.send(updatedDoenca);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao atualizar doença." });
    }
  }
}
