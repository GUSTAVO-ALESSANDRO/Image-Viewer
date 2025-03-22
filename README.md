# Image-Viewer
Projeto com React Native, Expo, Flask e OpenSeaDragon, para renderização de imagens pesadas.

# IMAGE VIEWER - README

# Descrição do Projeto:
O Image Viewer é uma solução integrada desenvolvida com React Native (usando Expo) e Flask.
Seu principal objetivo é renderizar imagens de alta resolução de forma interativa.
O projeto processa arquivos .svs – que são muito pesados – e os converte para o formato .dzi e alguns arquivos de titles,
permitindo visualização avançada com zoom e pan através do OpenSeaDragon.

# Composição do Projeto:
- Servidor Flask: Processa as imagens, converte arquivos .svs para .dzi e serve as imagens via APIs.
- Aplicativo React Native/Expo: Apresenta as imagens ao usuário através de componentes como WebView.
- Página HTML (index.html): Usada para exibir imagens no navegador, renderizando imagens com o OpenSeaDragon ou
reornando uma tag html de imagem.

# Funcionalidades:

# 1. Servidor Flask:
   - Processa imagens na pasta local `images` ou links e converte arquivos .svs para .dzi utilizando pyvips.
   - Suporta links de imagens do Google Drive no formato .svs, que precisam ser formatados corretamente.
   - Exemplo:
     
     Link original: `https://drive.google.com/file/d/1XIdMC2HMut_Pxnty_O0RpX1xvIaA-fFu/view?usp=drive_link`
     
     Link transformado: `https://drive.google.com/uc?id=1XIdMC2HMut_Pxnty_O0RpX1xvIaA-fFu`.
     
     Utiliza somente o id do link, que posteriormente sera transformado no nome do arquivo .dzi
     
   - Rotas disponíveis:
     - `/`: Serve o arquivo `index.html`.
     - `/list-images`: Retorna um JSON com os nomes das imagens disponíveis.
     - `/images/<arquivo>`: Serve imagens comuns da pasta `images` (como JPEG ou PNG).
     - `/static/<arquivo>`: Serve imagens convertidas em .dzi da pasta `static`.

     OBS: O servidor, para conversão, funciona da seguinte maneira, verifica na pasta local `images`, se há o .dzi correspondente a cada 
    imagem `.svs`, pois as de outra extensão ele as pula, caso não tenha o `.dzi` de alguma imagem `.svs`, cria-se o `.dzi` e o os titles 
    correspondentes, depois de toda a verificação e transformação, verifica-se os link, que estes devem ser SOMENTE de extensão `.svs`,
    pois não há como verificar a extensão sem antes instala-lo, caso seja de outra extensão, ele também será convertido a `.dzi` de forma 
    ineficaz, assim, para cada link, verifica-se se ja existe o `.dzi` correspondente, pois compara o nome do arquivo com o link, caso não haja, 
    instala temporariamente o arquivo em uma pasta `temp` com o nome sendo o id do link e cria o seu `.dzi` e titles, logo após exclui-se o 
    arquivo da pasta temporaria.

# 2. Aplicativo React Native/Expo:
   - Home:
     - Tela inicial com botões que levam para as páginas de visualização.
   - PageButton:
     - Exibe os nomes das imagens como botões.
     - Cada botão carrega um WebView para exibir a imagem; arquivos .dzi são visualizados com o OpenSeaDragon,
       enquanto outros formatos são exibidos normalmente.
   - PageList:
     - Apresenta uma lista de imagens em um componente Picker.
     - A imagem selecionada é renderizada em um WebView.
   - WebView:
     - Exibe o conteúdo do HTML diretamente no aplicativo.

# 3. Página HTML (index.html):
   - Lê o parâmetro `image` da URL (ex.: `?image=nome_imagem.dzi`).
   - Utiliza OpenSeaDragon para renderizar arquivos `.dzi` com zoom e pan.
   - Imagens de outros formatos são exibidas com uma tag `<img>`.

# Como Usar o Image Viewer:

# 1. Clonar o Repositório:
   Execute no terminal:
   
   `git clone https://github.com/GUSTAVO-ALESSANDRO/Image-Viewer.git`
   
   `cd image-viewer`

# 2. Instalar as Dependências:
   Execute na pasta raiz:
   
   `npm install`
   
   para instalação de dependências

# 3. Iniciar o Servidor Flask:
   Navegue até a pasta onde o arquivo `server.py` está e execute:
   
   `python server.py`
   
   O servidor será iniciado na porta 8000.

# 4. Iniciar o Projeto Expo:
   Na raiz do projeto, execute:
   
   `npx expo start --web`
   
   O aplicativo será aberto em uma URL (ex.: http://localhost:8081 ou http://localhost:19006).
   ou até 
   
   `npm start`
   
   para gerar um qrcode e url para funcionar com o expo Go

   OBS: Você terá de configurar o IP:
   
   Substitua `localhost` pelo IP local nos códigos (ex.: `http://192.168.2.110:8000`).
   Você deverá trocar para `localhost` se for usar a Web ou `seu IP da rede wifi` para funcionar
   no Expo Go. Por padrão está o IP que uso, mas não necessáriamente será o mesmo que o seu.
   Os arquivos que deverão ser modificados são `index.html`, `PageList` e `PageButton`, 
   Isso permitirá o funcionamento em dispositivos na mesma rede.

# Documentação e Referências:
- Flask: `https://flask.palletsprojects.com/`
- React Native: `https://reactnative.dev/`
- Expo: `https://docs.expo.dev/`
- OpenSeaDragon: `https://openseadragon.github.io/`
- Artigo no Medium: `https://medium.com/@Chitturi_Teja/display-svs-images-using-openseadragon-in-a-react-js-and-flask-application-ad5e35aa125`

# Conclusão:
O Image Viewer é usado para visualização interativa de imagens de alta resolução.
Ele combina processamento de arquivos `.svs` para `.dzi` com visualizações interativas usando OpenSeaDragon e React Native.
Garanta que os IPs estejam configurados corretamente e siga os passos para instalação e uso.
