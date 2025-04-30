// server.ts
import Fastify from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";
import { readdir, stat } from "fs/promises";
import { exec } from "child_process";
import { routes as crudRoutes } from "./src/routes/routes";

const server = Fastify({ logger: true });
const __dirname = path.resolve();

// Função para executar o script Python de pré-processamento das imagens
function runPythonScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = exec("python -u process_images.py", (error, stdout, stderr) => {
      if (error) {
        console.error(`[PYTHON ERROR] ${error.message}`);
        reject(error);
      } else {
        resolve();
      }
    });
    process.stdout?.on("data", (data) =>
      console.log(`[PYTHON STDOUT]: ${data.toString()}`)
    );
    process.stderr?.on("data", (data) =>
      console.error(`[PYTHON STDERR]: ${data.toString()}`)
    );
  });
}

async function start() {
  try {
    // 1. Executa o script Python de pré-processamento das imagens
    await runPythonScript();
    console.log("Processamento das imagens concluído.");

    // 2. Registra o plugin para servir os arquivos estáticos da pasta "public"
    server.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
      prefix: "/", // Servirá arquivos como /index.html, /static/...
    });

    // 3. Registra um segundo plugin para servir as views (como o crud.html)
    server.register(fastifyStatic, {
      root: path.join(__dirname, "src", "views"),
      prefix: "/views/",
      decorateReply: false,
    });

    // 4. Rota raiz: serve index.html (visualizador de imagens)
    server.get("/", async (request, reply) => {
      return reply.sendFile("index.html");
    });

    // 5. Endpoint para listar imagens: lê a pasta public/static
    server.get("/list-images", async (request, reply) => {
      try {
        const imagesDir = path.join(__dirname, "public", "static");
        const files = await readdir(imagesDir);
        const filteredFiles: string[] = [];
        for (const file of files) {
          const filePath = path.join(imagesDir, file);
          const fileStat = await stat(filePath);
          if (fileStat.isFile()) {
            filteredFiles.push(file);
          }
        }
        return reply.send(filteredFiles);
      } catch (err) {
        return reply.status(500).send({ error: "Não foi possível listar os arquivos." });
      }
    });

    // 6. Rota para a interface de CRUD: redireciona para /views/crud.html
    server.get("/crud", async (request, reply) => {
      return reply.sendFile("crud.html", path.join(__dirname, "src", "views"));
    });

    // 7. Registra as rotas da API CRUD
    await server.register(crudRoutes);

    // 8. Inicia o servidor na porta 3333
    await server.listen({ port: 3333, host: "0.0.0.0" });
    console.log("Servidor rodando em http://localhost:3333");
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
