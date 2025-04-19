#!/usr/bin/env python3
import os
import shutil
import pyvips
import sys

# Configura o encoding para UTF-8 (evita erros no Windows)
sys.stdout.reconfigure(encoding="utf-8")

# Diretórios de entrada e saída
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, "public", "image")
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "static")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Processa arquivos no diretório de entrada
for fname in os.listdir(INPUT_DIR):
    name, ext = os.path.splitext(fname)
    src = os.path.join(INPUT_DIR, fname)
    
    # Se já existe {name}.dzi em static, pula
    if os.path.exists(os.path.join(OUTPUT_DIR, f"{name}.dzi")):
        print(f"[PULADO] {fname}")
        continue

    # Converte .svs para .dzi
    if ext.lower() == ".svs":
        try:
            img = pyvips.Image.new_from_file(src, access="sequential")
            img.dzsave(os.path.join(OUTPUT_DIR, name), layout="dz")
            print(f"[CONVERTIDO] {fname} -> {name}.dzi")
        except Exception as e:
            print(f"[ERRO] {fname}: {e}")
    else:
        # Copia arquivos PNG/JPG/etc.
        dst = os.path.join(OUTPUT_DIR, fname)
        shutil.copy2(src, dst)
        print(f"[COPIADO] {fname} -> static/")
