# GitHub Actions CI/CD

Este directorio contiene los workflows de GitHub Actions para el proyecto de facturación electrónica.

## 🚀 Workflow Principal: `ci.yml`

### Triggers
- **Push** a ramas `main` y `develop`
- **Pull Requests** a la rama `main`

### Jobs

#### 1. **Test** 
- ✅ Se ejecuta en **Node.js 18.x y 20.x**
- 🔍 **Type checking** con TypeScript
- 🎨 **Linting** con Prettier
- 🧪 **Tests con coverage** usando Jest
- 📊 **Upload coverage** a Codecov (solo Node 20.x)

#### 2. **Build**
- 🏗️ Se ejecuta **solo en rama main**
- ⚠️ **Requiere** que pasen todos los tests
- 📦 Compila la aplicación TypeScript
- ✅ Ejecuta validación completa

#### 3. **Security Scan**
- 🔒 **Auditoría de seguridad** con npm audit
- 🛡️ **Verificación de vulnerabilidades**
- ⚠️ Continúa en caso de errores (informativo)

## 📋 Scripts Disponibles

```bash
# Validación completa (lo que ejecuta CI)
npm run validate

# Tests con coverage
npm run test:ci

# Verificación de tipos
npm run typecheck

# Formateo de código
npm run lint:fix
```

## 🎯 Coverage Thresholds

Actualmente configurado para desarrollo:
- **Statements**: 40%
- **Branches**: 20%
- **Functions**: 35%
- **Lines**: 40%

*Nota: Estos umbrales se incrementarán conforme se agreguen más tests.*

## 🔧 Configuración Local

Para que el workflow funcione correctamente:

1. **Verificar que los tests pasen localmente:**
   ```bash
   npm run validate
   ```

2. **Formatear código antes de commit:**
   ```bash
   npm run lint:fix
   ```

3. **Verificar coverage:**
   ```bash
   npm run test:coverage
   ```

## 🚫 Deploy Blocking

El sistema está configurado para **bloquear deploys** si:
- ❌ Los tests fallan
- ❌ El linting falla  
- ❌ La compilación TypeScript falla
- ❌ El coverage está por debajo del umbral

## 🔗 Integración con Hosting

Para habilitar la opción **"Wait for GitHub checks to pass before deploy"** en tu plataforma de hosting:

1. ✅ Este workflow debe estar en la rama `main`
2. ✅ Debe ejecutarse exitosamente al menos una vez
3. ✅ En la plataforma de hosting, habilitar la opción de esperar por checks

### Plataformas Soportadas
- Vercel
- Netlify  
- Railway
- Render
- Heroku (con GitHub integration)

## 📈 Métricas

El workflow rastrea:
- ⏱️ **Tiempo de ejecución** de tests
- 📊 **Porcentaje de coverage**
- 🔍 **Vulnerabilidades de seguridad**
- ✅ **Estado de checks** para deploy automático 