#!/usr/bin/env python3
import os
import shutil
import re
import json
import requests
import pyvips
from dotenv import load_dotenv
import psycopg2

# Carrega variáveis de ambiente para conexão com o banco de dados
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
# Se necessário, remova os parâmetros que não são aceitos pelo driver do Python
if DATABASE_URL and "?" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]
    print(f"[INFO] DATABASE_URL ajustado para: {DATABASE_URL}")

# Diretórios de entrada e saída
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, "public", "image")
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "static")
os.makedirs(INPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Função para conectar ao banco de dados e obter os registros da tabela 'doencas'
def get_links_from_db():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("[INFO] Conectado ao banco de dados com sucesso.")
        cursor.execute("SELECT id, links FROM doencas")
        doencas = cursor.fetchall()
        conn.close()
        print(f"[INFO] Recuperados {len(doencas)} registros do banco de dados.")
        return doencas
    except Exception as e:
        print(f"[ERRO] Falha ao conectar ao banco de dados: {e}")
        return []

# Função para baixar o arquivo do Google Drive
def download_from_gdrive(link, save_path_without_extension):
    try:
        # Extrai o file_id do link (assumindo o padrão /d/<file_id>/)
        file_id = link.split("/d/")[1].split("/")[0]
    except IndexError:
        print(f"[ERRO] Link inválido: {link}")
        return

    # Converte o link para o formato de download
    download_url = f"https://drive.google.com/uc?id={file_id}&export=download"
    try:
        response = requests.get(download_url, stream=True)
    except Exception as e:
        print(f"[ERRO] Falha na requisição para {download_url}: {e}")
        return

    if response.status_code == 200:
        ext = ".svs"  # Extensão padrão
        content_disp = response.headers.get("Content-Disposition")
        if content_disp:
            match = re.findall(r'filename="?([^";]+)"?', content_disp)
            if match:
                ext = os.path.splitext(match[0])[1].lower()
        full_save_path = save_path_without_extension + ext
        try:
            with open(full_save_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"[BAIXADO] {file_id}{ext} salvo em {INPUT_DIR}")
        except Exception as e:
            print(f"[ERRO] Problema ao salvar o arquivo {full_save_path}: {e}")
    else:
        print(f"[ERRO] Falha no download do {file_id}. Status: {response.status_code}")

# Função para processar (converter ou copiar) imagens da pasta de entrada para a pasta de saída
def process_images():
    for fname in os.listdir(INPUT_DIR):
        name, ext = os.path.splitext(fname)
        src = os.path.join(INPUT_DIR, fname)
        static_file_path = os.path.join(OUTPUT_DIR, f"{name}.dzi" if ext.lower() == ".svs" else fname)
        if os.path.exists(static_file_path):
            print(f"[PULADO] {fname} já existe em {OUTPUT_DIR}")
            continue
        if ext.lower() == ".svs":
            try:
                img = pyvips.Image.new_from_file(src, access="sequential")
                img.dzsave(os.path.join(OUTPUT_DIR, name), layout="dz")
                print(f"[CONVERTIDO] {fname} -> {name}.dzi")
            except Exception as e:
                print(f"[ERRO] Ao converter {fname}: {e}")
        elif ext.lower() in [".png", ".jpg", ".jpeg", ".webp"]:
            try:
                shutil.copy2(src, os.path.join(OUTPUT_DIR, fname))
                print(f"[COPIADO] {fname} copiado para {OUTPUT_DIR}")
            except Exception as e:
                print(f"[ERRO] Ao copiar {fname}: {e}")
        else:
            print(f"[IGNORADO] {fname}: extensão {ext} não suportada.")

# Função principal que busca os links do banco, faz o download e processa as imagens
def download_and_process_links():
    doencas = get_links_from_db()
    for doenca_id, links_json in doencas:
        try:
            # Converte o conteúdo do campo links.
            if isinstance(links_json, str):
                try:
                    links_data = json.loads(links_json)
                except Exception as je:
                    print(f"[ERRO] Ao converter JSON para a doença ID {doenca_id}: {je}")
                    continue
            else:
                links_data = links_json

            # Verifica se links_data é uma lista ou um dicionário
            if isinstance(links_data, list):
                links = links_data
            elif isinstance(links_data, dict) and "links" in links_data:
                links = links_data["links"]
            else:
                links = []

            print(f"[INFO] Doença ID {doenca_id} possui {len(links)} link(s).")
            for link in links:
                try:
                    file_id = link.split("/d/")[1].split("/")[0]
                except IndexError:
                    print(f"[ERRO] Link inválido: {link}")
                    continue
                # Se já existe um arquivo com esse id na pasta de entrada, pula
                if any(f.startswith(file_id) for f in os.listdir(INPUT_DIR)):
                    print(f"[PULADO] Arquivo {file_id} já existe em {INPUT_DIR}")
                else:
                    download_from_gdrive(link, os.path.join(INPUT_DIR, file_id))
        except Exception as e:
            print(f"[ERRO] Erro ao processar links da doença ID {doenca_id}: {e}")
    process_images()


if __name__ == "__main__":
    download_and_process_links()
