import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { readdir, stat } from 'fs/promises';
import { exec } from 'child_process';

const server = Fastify({ logger: true });
const __dirname = path.resolve();

// Função para executar o script Python
function runPythonScript() {
  return new Promise((resolve, reject) => {
    const process = exec('python -u process_images.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar o script Python: ${error.message}`);
        reject(error);
      } else {
        resolve(stdout);
      }
    });

    // Captura saída padrão (stdout) e de erro (stderr) do script Python e exibe no terminal
    process.stdout?.on('data', (data) => console.log(`[PYTHON STDOUT]: ${data.toString()}`));
    process.stderr?.on('data', (data) => console.error(`[PYTHON STDERR]: ${data.toString()}`));
  });
}

// Antes de inicializar o servidor, executa o processamento das imagens
runPythonScript()
  .then(() => {
    console.log('Processamento das imagens concluído.');

    // Registra o plugin para servir arquivos estáticos da pasta `public/static`
    server.register(fastifyStatic, {
      root: path.join(__dirname, 'public', 'static'),
      prefix: '/static/', // Links como http://localhost:3000/static/arquivo.png
    });

    // Rota raiz para servir a página HTML
    server.get('/', async (request, reply) => {
      return reply.sendFile('index.html', path.join(__dirname, 'public'));
    });

    // Endpoint para listar todos os arquivos da pasta `public/static` (somente arquivos, sem pastas)
    server.get('/list-images', async (request, reply) => {
      try {
        const imagesDir = path.join(__dirname, 'public', 'static');
        const files = await readdir(imagesDir);

        // Verifica se cada item é um arquivo
        const filteredFiles = [];
        for (const file of files) {
          const filePath = path.join(imagesDir, file);
          const fileStat = await stat(filePath);

          if (fileStat.isFile()) {
            filteredFiles.push(file); // Adiciona apenas arquivos
          }
        }

        reply.send(filteredFiles); // Retorna todos os arquivos (exclui pastas)
      } catch (err) {
        reply.status(500).send({ error: 'Não foi possível listar os arquivos.' });
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
  })
  .catch(err => {
    console.error('Falha no pré-processamento das imagens:', err);
  });
