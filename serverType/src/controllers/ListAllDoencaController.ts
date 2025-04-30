// src/controllers/ListAllDoencaController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prismaClient";

export class ListAllDoencaController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const doencas = await prismaClient.doencas.findMany();
      reply.send(doencas);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao listar doenças." });
    }
  }
}
