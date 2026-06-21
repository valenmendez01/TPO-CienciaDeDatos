#!/usr/bin/env bash
# Build estático de la webapp: compila los JSX de src/app/ a JS plano en public/app/
# y copia HTML, CSS y datos. public/ es lo que se sube a Cloudflare Pages.
set -euo pipefail
cd "$(dirname "$0")"

mkdir -p public/app public/data public/vendor

# 1. JSX → JS (una sola vez, en build — sin transpilador en runtime)
#    Solo transforma sintaxis (sin bundle): los archivos siguen siendo scripts
#    clásicos que comparten el scope global, igual que en el prototipo.
npx -y esbuild src/app/*.jsx --loader:.jsx=jsx --jsx=transform --outdir=public/app

# 2. estáticos
cp src/index.html src/styles.css public/
cp src/data/aggregates.js src/data/comunas.geojson public/data/
cp -R src/defensa public/   # deck de defensa (24 slides) → /defensa/

# 3. vendor (solo si faltan — pineados, self-hosted)
fetch() { [ -f "public/vendor/$1" ] || curl -sfL "$2" -o "public/vendor/$1"; }
fetch leaflet.css               https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
fetch leaflet.js                https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
fetch leaflet-heat.js           https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js
fetch react.production.min.js   https://unpkg.com/react@18.3.1/umd/react.production.min.js
fetch react-dom.production.min.js https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js

echo "OK → webapp/public/"
