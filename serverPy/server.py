import os
import requests  # Biblioteca para realizar downloads de arquivos
from flask import Flask, jsonify, send_from_directory

import pyvips
print(pyvips.foreign_find_load("temp/1morz2n0UNF-31AFY3Q-a164bzONgcXGM.svs"))


app = Flask(__name__)

# Links do Google Drive para arquivos de teste
google_drive_links = [
    "https://drive.google.com/uc?id=1vZ7qLzrCj-u-XN-DPrXFaOg1P1u2V5VR",
    "https://drive.google.com/uc?id=1XIdMC2HMut_Pxnty_O0RpX1xvIaA-fFu",
    "https://drive.google.com/uc?id=1morz2n0UNF-31AFY3Q-a164bzONgcXGM",
]

# Função para converter arquivos .svs para o formato .dzi
def convert_svs_to_dzi(svs_path, dzi_path):
    try:
        import pyvips  # Biblioteca para manipulação de imagens
        if not os.path.exists(dzi_path):  # Cria o diretório de saída se não existir
            os.makedirs(dzi_path)
        svs_image = pyvips.Image.new_from_file(svs_path)
        svs_image.dzsave(dzi_path)
        print(f"[INSTALADO] Arquivo {svs_path} convertido para formato DZI.")
    except Exception as e:
        print(f"[ERRO] Conversão de {svs_path} para DZI falhou: {e}")

# Função para baixar arquivos do Google Drive
def download_from_google_drive(url, save_path):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"[BAIXADO] Arquivo salvo em {save_path}.")
        else:
            print(f"[ERRO] Falha ao baixar arquivo: {response.status_code}")
    except Exception as e:
        print(f"[ERRO] Erro no download do Google Drive: {e}")

# Processa imagens do Google Drive
def process_google_drive_images(google_drive_links, temp_folder, output_folder):
    for link in google_drive_links:
        try:
            # Gera nome do arquivo baseado no ID do Google Drive
            file_name = link.split("id=")[-1] + ".svs"
            dzi_path = os.path.join(output_folder, os.path.splitext(file_name)[0])

            # Verifica se o arquivo já foi convertido
            if os.path.exists(f"{dzi_path}.dzi"):
                print(f"[PULADO] Arquivo {file_name} já convertido.")
                continue

            # Faz download e converte para .dzi
            temp_path = os.path.join(temp_folder, file_name)
            download_from_google_drive(link, temp_path)
            convert_svs_to_dzi(temp_path, dzi_path)
            os.remove(temp_path)  # Remove arquivo temporário
        except Exception as e:
            print(f"[ERRO] Falha ao processar {link}: {e}")

# Processamento inicial de imagens
def process_images():
    input_folder = "images"  # Pasta de entrada
    output_folder = "static"  # Pasta para arquivos .dzi
    temp_folder = "temp"  # Pasta temporária

    # Criar as pastas necessárias
    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(temp_folder, exist_ok=True)

    # Processa arquivos locais
    print("=== Processando imagens locais ===")
    for file in os.listdir(input_folder):
        if file.endswith(".svs"):
            svs_path = os.path.join(input_folder, file)
            dzi_path = os.path.join(output_folder, os.path.splitext(file)[0])
            if os.path.exists(f"{dzi_path}.dzi"):
                print(f"[PULADO] {file} já convertido.")
                continue
            convert_svs_to_dzi(svs_path, dzi_path)

    # Processa arquivos do Google Drive
    print("=== Processando imagens do Google Drive ===")
    process_google_drive_images(google_drive_links, temp_folder, output_folder)

# Endpoint para listar imagens disponíveis
@app.route('/list-images', methods=['GET'])
def list_images():
    try:
        files = []
        for file in os.listdir('images'):  # Busca imagens na pasta "images"
            if file.endswith(('.png', '.jpeg', '.jpg')):
                files.append(file)
        for dirpath, _, filenames in os.walk('static'):
            for file in filenames:
                if file.endswith('.dzi'):
                    dzi_path = os.path.relpath(os.path.join(dirpath, file), 'static')
                    files.append(dzi_path)
        return jsonify(files)  # Retorna a lista como JSON
    except Exception as e:
        print(f"[ERRO] Não foi possível listar imagens: {e}")
        return jsonify({"error": "Erro ao listar imagens."}), 500

# Rota principal para servir o arquivo index.html
@app.route('/', methods=['GET'])
def serve_index():
    return send_from_directory('.', 'index.html')

if __name__ == "__main__":
    process_images()  # Processa as imagens ao iniciar
    app.run(host="0.0.0.0", port=8000, debug=True)  # Inicia o servidor