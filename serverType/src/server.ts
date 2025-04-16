import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { readdir } from 'fs/promises';

const server = Fastify({ logger: true });
const __dirname = path.resolve();

// Registra o plugin para servir arquivos estáticos da pasta "public"
server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/', // Por exemplo, a URL "http://localhost:3000/image/Masto.dzi" será resolvida para "public/image/Masto.dzi"
});

/*// Rota raiz para servir a página HTML
server.get('/', async (request, reply) => {
  reply.sendFile('index.html', path.join(__dirname, 'public'));
});*/

// Endpoint opcional para listar arquivos .dzi na pasta "public/image"
server.get('/list-images', async (request, reply) => {
  try {
    const imagesDir = path.join(__dirname, 'public', 'image');
    const files = await readdir(imagesDir);
    // Filtra os arquivos que terminam com .dzi
    const dziFiles = files.filter(file => file.endsWith('.dzi'));
    reply.send(dziFiles);
  } catch (err) {
    reply.status(500).send({ error: 'Não foi possível listar imagens.' });
  }
});

// Inicializa o servidor
server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
