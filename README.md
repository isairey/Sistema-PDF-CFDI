<div align="center">

<img width="220" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" />

# 🇲🇽 Sistema PDF CFDI SAT

### Generación automática de PDFs para facturas electrónicas CFDI 4.0 🚀

<p align="center">
  <b>Sistema PDF CFDI SAT</b> es una solución moderna para generar automáticamente PDFs de comprobantes fiscales digitales compatibles con el SAT de México y el estándar CFDI 4.0.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-Programming-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/CFDI-4.0-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/SAT-México-006847?style=for-the-badge">
</p>

<p align="center">
  <a href="#-acerca-del-proyecto">Acerca</a> •
  <a href="#-características">Características</a> •
  <a href="#-tecnologías-utilizadas">Tecnologías</a> •
  <a href="#-instalación">Instalación</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

</div>

---

# 🌌 Acerca del proyecto

**Sistema PDF CFDI SAT** es una plataforma diseñada para generar automáticamente comprobantes fiscales digitales en formato PDF compatibles con el SAT de México y el estándar CFDI 4.0.

El sistema automatiza la generación de PDFs cuando la factura es timbrada y autorizada correctamente.

El sistema permite:

- 📄 Generación automática de PDFs CFDI
- 🧾 Facturación electrónica SAT
- 📦 Gestión documental
- 📊 Administración de comprobantes
- 🔐 Seguridad y trazabilidad
- 📧 Preparación para envío por email
- 🏢 Gestión empresarial
- ⚡ Descarga y regeneración de PDFs

El proyecto fue desarrollado para practicar:

- Generación dinámica de PDFs
- Integración CFDI 4.0
- Node.js y TypeScript
- APIs REST
- Automatización empresarial
- Arquitectura backend moderna

---

# ✨ Características

## 📄 Generación automática de PDF

- ✅ Generación automática tras timbrado SAT
- ✅ Formato profesional CFDI 4.0
- ✅ PDFs listos para impresión
- ✅ Conversión HTML → PDF con Puppeteer
- ✅ Descarga inmediata

---

## 🧾 Gestión de comprobantes

- 🏢 Facturación electrónica CFDI
- 📄 Administración de documentos
- 🔑 UUID fiscal SAT
- 📦 Historial de PDFs
- 🔄 Regeneración de PDFs

---

## 📧 Sistema de emails

- 📩 Preparación para envío automático
- 📎 Adjuntos PDF
- 📨 Plantillas HTML
- 🔁 Reintentos automáticos
- 📊 Estado de envíos

---

## 🔒 Seguridad

- 🔐 Autenticación API
- 🛡️ Protección de endpoints
- 📄 Validación documental
- 👨‍💻 Gestión de accesos

---

## 📊 Administración

- 📈 Dashboard administrativo
- 📋 Gestión de estados
- 📦 Metadatos PDF
- 💾 Almacenamiento de buffers

---

# 🛠️ Tecnologías utilizadas

## 🌐 Backend

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,ts,express" />
</p>

- Node.js
- TypeScript
- Express
- APIs REST

---

## 🗄️ Base de datos

<p>
  <img src="https://skillicons.dev/icons?i=postgresql,mysql" />
</p>

- PostgreSQL
- MySQL
- ORM
- SQL

---

## 📄 PDF y automatización

<p>
  <img src="https://skillicons.dev/icons?i=html,css,js" />
</p>

- Puppeteer
- HTML5
- CSS3
- Renderizado PDF

---

## 🐳 Herramientas

<p>
  <img src="https://skillicons.dev/icons?i=docker,git,github,npm" />
</p>

- Docker
- Git
- GitHub
- NPM

---

# 📂 Estructura del proyecto

```bash
cfdi-pdf-system/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── templates/
│
├── uploads/
│
├── temp/
│
├── package.json
│
└── README.md
```

---

# ⚡ Instalación

## 📋 Requisitos

- Node.js
- NPM
- PostgreSQL o MySQL
- Puppeteer
- Docker (opcional)

---

# 🚀 Configuración del proyecto

## 1️⃣ Clonar repositorio

```bash
git clone https://github.com/usuario/cfdi-pdf-system.git
```

---

## 2️⃣ Entrar al proyecto

```bash
cd cfdi-pdf-system
```

---

## 3️⃣ Instalar dependencias

```bash
npm install
```

---

## 4️⃣ Configurar variables de entorno

```bash
cp .env.example .env
```

---

## 5️⃣ Ejecutar migraciones

```bash
npm run migrate
```

---

## 6️⃣ Ejecutar servidor

```bash
npm run dev
```

---

# 🌐 Endpoints API

## 📄 Gestión de PDFs

```bash
GET    /api/v1/cfdi-pdf/
GET    /api/v1/cfdi-pdf/invoice/:facturaId
GET    /api/v1/cfdi-pdf/uuid/:uuid
GET    /api/v1/cfdi-pdf/download/:uuid
POST   /api/v1/cfdi-pdf/regenerate/:id
```

---

## 📧 Gestión de emails

```bash
POST /api/v1/cfdi-pdf/send-email/:uuid
GET  /api/v1/cfdi-pdf/email-status/:uuid
POST /api/v1/cfdi-pdf/retry-email/:uuid
```

---

# 🧾 Flujo del sistema

## ⚡ Proceso automático

1. 📄 Creación CFDI
2. 🔐 Firma digital SAT
3. 📡 Timbrado fiscal
4. ✅ CFDI autorizado
5. 📄 Generación automática PDF
6. 💾 Almacenamiento en base de datos

---

# 📄 Formato del PDF

## 📋 Información incluida

- 🏢 Datos fiscales empresa
- 🔑 UUID SAT
- 📅 Fecha de timbrado
- 👤 Información del receptor
- 📦 Productos y conceptos
- 💰 IVA e impuestos
- 📧 Información adicional
- 🧾 Datos fiscales CFDI 4.0

---

# 📧 Sistema de emails

## 📨 Estados de envío

- ⚪ NO_ENVIADO
- 🟡 PENDIENTE
- 🟢 ENVIADO
- 🔴 ERROR

---

## ✉️ Funcionalidades

- 📎 Adjuntar PDFs CFDI
- 📨 Plantillas HTML responsivas
- 🔁 Reintentos automáticos
- 📊 Seguimiento de envíos

---

# 📸 Vista previa

<div align="center">

<img width="1000" src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop" />

</div>

---

# 🧠 Objetivos del proyecto

## 🎯 Aprender y practicar

- Node.js
- TypeScript
- Puppeteer
- CFDI 4.0
- APIs REST
- Automatización PDF
- Arquitectura backend
- Integración SAT

---

# 🚧 Roadmap

## 🔮 Próximas mejoras

- ☁️ Integración con AWS S3
- 📱 Dashboard responsive
- 🤖 Automatización inteligente
- 📊 Analytics avanzados
- 📧 Sistema completo de emails
- 🔔 Notificaciones automáticas
- 📄 Plantillas personalizadas

---

# 🤝 Contribuciones

Las contribuciones son bienvenidas ❤️

## Cómo contribuir

1. Fork del proyecto

```bash
git checkout -b feature/nueva-funcionalidad
```

2. Commit

```bash
git commit -m "✨ Nueva funcionalidad"
```

3. Push

```bash
git push origin feature/nueva-funcionalidad
```

4. Pull Request 🚀

---

# 👨‍💻 Autor

<div align="center">

## Sistema PDF CFDI SAT

Desarrollado para automatización de comprobantes fiscales digitales y generación profesional de PDFs compatibles con CFDI 4.0.

</div>

---

# 🌟 Apoya el proyecto

⭐ Dale una estrella  
🍴 Haz fork  
📢 Comparte el proyecto

---

# 📜 Licencia

Proyecto educativo y empresarial desarrollado para automatización de facturación electrónica CFDI 4.0 y generación de documentos fiscales digitales para México.

---

<div align="center">

### 🇲🇽 Sistema PDF CFDI SAT — automatización inteligente de comprobantes electrónicos 🚀

</div>
