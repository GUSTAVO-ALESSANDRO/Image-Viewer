# Image-Viewer

Projeto com React Native, Expo, Fastify (serverType) e Flask (serverPy) para renderização de imagens de alta resolução.

---

## Descrição do Projeto

O Image-Viewer é uma solução integrada que converte arquivos **`.svs`** — tipicamente muito pesados, usados em imagens de lâminas de microscopia — para o formato **Deep Zoom Image (`.dzi`)**, permitindo zoom e pan de alta performance via OpenSeadragon. O frontend em React Native (usando Expo) exibe essas imagens de forma interativa, enquanto o backend oferece duas opções:

1. **serverType (Fastify)** – **RECOMENDADO**
2. **serverPy (Flask)** – **FUNCIONAL, MAS NÃO RECOMENDADO**

---

## Funcionalidades Principais

### 1. Conversão de Imagens

- Detecta arquivos `.svs` na pasta `images/` ou via links do Google Drive (formato `uc?id=<ID>`).
- Converte cada `.svs` em `.dzi` + tiles usando PyVips (direto no Python).
- Armazena tiles e metadados em `static/` para entrega otimizada.

### 2. Rotas Disponíveis

| Rota                | Descrição                                                  |
|---------------------|------------------------------------------------------------|
| `/`                 | Serve `index.html` (visualização no navegador)            |
| `/list-images`      | Retorna JSON com lista de imagens disponíveis              |
| `/images/:file`     | Serve imagens comuns (`.png`, `.jpg`, etc.)               |
| `/static/:tilePath` | Serve tiles `.dzi` e metadados para OpenSeadragon         |

### 3. Aplicativo Mobile (Expo)

- **Home**: Tela inicial com navegação para visualização.
- **PageList**: Picker com lista de imagens; ao selecionar, carrega WebView.
- **PageButton**: Botões com nomes das imagens; cada botão abre WebView.
- **WebView**: Exibe `index.html?image=<nome>.dzi` com OpenSeadragon.

### 4. Página HTML (`web/index.html`)

- Lê parâmetro `?image=` da URL.
- Para arquivos `.dzi`, instancia OpenSeadragon para zoom & pan.
- Para outros formatos, usa `<img>` padrão.

---

## Como Usar

### 1. Clonar o Repositório
```bash
git clone https://github.com/GUSTAVO-ALESSANDRO/Image-Viewer.git
cd Image-Viewer
```

### 2. Iniciar o Backend

#### A) serverType (Fastify) – **RECOMENDADO**
```bash
cd serverType
npm install
cp .env.example .env    # configure porta e diretórios
npm run start            # inicia em http://localhost:3333
```

#### B) serverPy (Flask) – **FUNCIONAL, NÃO RECOMENDADO**
```bash
cd serverPy
python -m venv venv
env\Scripts\activate   # Windows
# source venv/bin/activate # macOS/Linux
pip install -r requirements.txt
python server.py          # inicia em http://localhost:8000
```

### 3. Iniciar o Frontend Expo
```bash
cd app
npm install
npx expo start --web
```
> **Dica:** substitua `localhost` pelo IP local em `index.html`, `PageList` e `PageButton` para usar no Expo Go em dispositivos na mesma rede.

---

## Referências e Documentação

- **Flask**: https://flask.palletsprojects.com/
- **React Native**: https://reactnative.dev/
- **Expo**: https://docs.expo.dev/
- **OpenSeadragon**: https://openseadragon.github.io/
- **PyVips**: https://libvips.github.io/pyvips/

---

## Considerações Finais

- Garanta que as variáveis de ambiente e IPs estejam configurados corretamente para acesso em rede.

