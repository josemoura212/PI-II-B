#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
rsvg-convert -w 1800 -b white assets/casos-de-uso.svg -o assets/casos-de-uso.png
{
  echo '<!DOCTYPE html><html lang="pt-br"><head><meta charset="utf-8"><title>Documento de Requisitos - SiGAT</title><style>'
  cat style.css
  echo '</style></head><body>'
  cat parte1.html parte2.html parte3.html
  echo '</body></html>'
} > SiGAT-Documento-de-Requisitos.html
chromium --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf="$PWD/SiGAT-Documento-de-Requisitos.pdf" \
  "file://$PWD/SiGAT-Documento-de-Requisitos.html" >/dev/null 2>&1
pdfinfo SiGAT-Documento-de-Requisitos.pdf | grep Pages
