# ⚠️  CLEANUP + SETUP

Tu repo tiene archivos duplicados en raíz que no deberían estar. Primero limpiar, luego agregar lo nuevo.

## 🧹 STEP 1: Borra estos archivos de la RAÍZ (están en src/ también)

```bash
rm Navbar.tsx
rm ProductCard.tsx
rm ProductDetailClient.tsx
rm layout.tsx
rm globals.css
rm products.ts
rm users.ts
rm "page (1).tsx"
rm "page (2).tsx"
rm "page (3).tsx"
rm "page (4).tsx"
rm "route (1).ts"
rm "route (2).ts"
rm route.ts
rm next-env.d.ts
rm "README (1).md"
rm gitignore        # Este no es .gitignore, borra el que no tiene punto
```

## ✅ STEP 2: Reemplaza estos 2 archivos CON los que voy a pasar

- `package.json` ← Reemplazar (agrega Playwright deps)
- `playwright.config.ts` ← Reemplazar o crear nuevo

## ✅ STEP 3: Agrega el workflow

Copiar `playwright.yml` a `.github/workflows/`

## 🧹 STEP 4: Limpia errores de test/ (SI EXISTEN)

Si en `tests/` hay una carpeta literal llamada `{smoke,navigation,content,api,a11y,visual,shadow-dom}`:

```bash
rm -rf tests/'{smoke,navigation,content,api,a11y,visual,shadow-dom}'
```

## 🚀 STEP 5: Instala y prueba

```bash
npm ci
npx playwright install --with-deps
npm run test:smoke
```

---

## 📋 Resumen de Lo Que Queda

Tu repo debería tener SOLO:
```
geeks-shop/
├── src/              ← Tu código (componentes, páginas)
├── public/           ← Assets
├── tests/            ← Tests (debe estar limpio)
├── .github/
│   └── workflows/
│       └── playwright.yml
├── playwright.config.ts
├── package.json      ← Actualizado
├── tsconfig.json     ← Original
├── .gitignore        ← Original (sin punto, borra "gitignore")
└── next.config.ts    ← Original
```

**SIN** archivos de componentes en raíz, **SIN** carpetas duplicadas en tests/.

---

Los archivos de tests/ que ya tenés están BIEN (base.page.ts, fixtures.ts, pages/, utils/, etc.). 
Solo necesita limpiar la raíz y actualizar package.json + agregar playwright.config.ts + workflow.

¿Hacés estos pasos y me avisas qué sigue?
