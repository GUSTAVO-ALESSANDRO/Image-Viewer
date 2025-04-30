// src/controllers/CreateControllerDoenca.ts
import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prismaClient";

export class CreateControllerDoenca {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { titulo, descricao, author, sintomas, links } = request.body as {
      titulo: string;
      descricao: string;
      author: string;
      sintomas: string;
      links: any;
    };

    try {
      const newDoenca = await prismaClient.doencas.create({
        data: {
          titulo,
          descricao,
          author,
          sintomas,
          links
        }
      });
      reply.status(201).send(newDoenca);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao criar doença." });
    }
  }
}
