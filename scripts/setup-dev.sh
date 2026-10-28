#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# --- root .env ---
if [ ! -f "$ROOT_DIR/.env" ]; then
    if [ -f "$ROOT_DIR/.env.example" ]; then
        echo "==> [root] Copying .env.example -> .env"
        cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    else
        echo "WARN: .env.example not found at root — skipping .env creation" >&2
    fi
else
    echo "==> [root] .env already exists — skipping"
fi

BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# --- pick a python launcher ---
if command -v python3 >/dev/null 2>&1; then
    PY=python3
elif command -v python >/dev/null 2>&1; then
    PY=python
else
    echo "ERROR: Python not found in PATH" >&2
    exit 1
fi

# --- backend ---
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo "==> [backend] Creating virtualenv at backend/.venv"
    "$PY" -m venv "$BACKEND_DIR/.venv"

    echo "==> [backend] pip install -e .[dev]"
    (
        cd "$BACKEND_DIR"
        ./.venv/bin/python -m pip install --upgrade pip
        ./.venv/bin/python -m pip install -e ".[dev]"
    )
else
    echo "==> [backend] .venv already exists — skipping"
fi

# --- frontend ---
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "==> [frontend] npm install"
    (cd "$FRONTEND_DIR" && npm install)
else
    echo "==> [frontend] node_modules already exists — skipping"
fi

echo "==> Setup complete ✅"