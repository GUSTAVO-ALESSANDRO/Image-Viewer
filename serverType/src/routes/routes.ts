// src/routes/routes.ts
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { CreateControllerDoenca } from "../controllers/CreateControllerDoenca";
import { ListAllDoencaController } from "../controllers/ListAllDoencaController";
import { DeleteDoencaController } from "../controllers/DeleteDoencaController";
import { GetByIdDoencaController } from "../controllers/GetByIdDoencaController";
import { UpdateDoencaController } from "../controllers/UpdateDoencaController";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post("/doenca", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateControllerDoenca().handle(request, reply);
  });

  fastify.get("/doenca", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListAllDoencaController().handle(request, reply);
  });

  fastify.get("/doenca/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new GetByIdDoencaController().handle(request, reply);
  });

  fastify.put("/doenca/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new UpdateDoencaController().handle(request, reply);
  });

  fastify.delete("/doenca/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteDoencaController().handle(request, reply);
  });
}
