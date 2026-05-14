# 🌐 Configuración de CORS

Este documento explica cómo se solucionó el problema de CORS en la aplicación.

## 🚨 **Problema Original**

Error en `https://app-eva-gym-canar-7c91975e103e.herokuapp.com/auth`:
```
CORS policy: Origin 'https://your-frontend-domain.com' has been blocked
```

## ✅ **Solución Implementada**

### 1. **Instalación de CORS**
```bash
npm install cors @types/cors
```

### 2. **Configuración Inteligente**

Se implementó una configuración de CORS que permite:

- ✅ **Desarrollo**: Cualquier `localhost` o `127.0.0.1`
- ✅ **Heroku Backend**: Tu dominio actual de Heroku
- ✅ **Peticiones sin origen**: Postman, aplicaciones móviles
- ✅ **Dominios personalizados**: Via variable de entorno

### 3. **Variables de Entorno**

Agrega estas variables a tu `.env` en Heroku:

```bash
# Para permitir dominios específicos (separados por coma)
ALLOWED_ORIGINS=https://tu-frontend.com,https://tu-app.vercel.app

# Para desarrollo/testing (deshabilita CORS completamente)
CORS_DISABLED=true

# Entorno de producción
NODE_ENV=production
```

### 4. **Configuración en Heroku**

En el dashboard de Heroku, ve a **Settings > Config Vars** y agrega:

| Key | Value |
|-----|-------|
| `ALLOWED_ORIGINS` | `https://tu-frontend-domain.com,https://otra-domain.com` |
| `NODE_ENV` | `production` |

## 🧪 **Testing de CORS**

### Endpoints de Prueba

1. **Health Check** (público):
   ```
   GET https://app-eva-gym-canar-7c91975e103e.herokuapp.com/health
   ```

2. **CORS Test** (público):
   ```
   GET https://app-eva-gym-canar-7c91975e103e.herokuapp.com/cors-test
   ```

3. **Auth Test** (público):
   ```
   POST https://app-eva-gym-canar-7c91975e103e.herokuapp.com/auth
   ```

### Desde el Frontend

```javascript
// Ejemplo con fetch
fetch('https://app-eva-gym-canar-7c91975e103e.herokuapp.com/cors-test', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Importante para CORS
})
.then(response => response.json())
.then(data => console.log('✅ CORS working:', data))
.catch(error => console.error('❌ CORS error:', error));
```

## 🔧 **Configuración para Diferentes Frontends**

### React (localhost:3000)
```bash
# Ya incluido automáticamente en desarrollo
```

### Angular (localhost:4200)
```bash
# Ya incluido automáticamente en desarrollo
```

### Vue.js (localhost:8080)
```bash
# Ya incluido automáticamente en desarrollo
```

### Frontend en Producción
```bash
# Agregar tu dominio a ALLOWED_ORIGINS en Heroku
ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://tu-frontend.netlify.app
```

## 🚀 **Deploy**

1. **Commit y push** los cambios:
   ```bash
   git add .
   git commit -m "fix: configure CORS for Heroku deployment"
   git push origin main
   ```

2. **Heroku se actualizará automáticamente** con la nueva configuración

3. **Verificar** que funciona con:
   ```bash
   curl -H "Origin: https://tu-frontend.com" \
        https://app-eva-gym-canar-7c91975e103e.herokuapp.com/cors-test
   ```

## 🐛 **Debugging**

Si sigues teniendo problemas:

1. **Verificar logs de Heroku**:
   ```bash
   heroku logs --tail -a app-eva-gym-canar
   ```

2. **Buscar estos mensajes**:
   ```
   🌐 CORS configured for: PRODUCTION
   📋 Allowed origins: [...]
   ✅ Origin allowed: https://tu-frontend.com
   🚫 CORS blocked origin: https://otro-origen.com
   ```

3. **Test temporal** (deshabilitar CORS):
   ```bash
   # En Heroku Config Vars
   CORS_DISABLED=true
   ```

## 📋 **Checklist de Verificación**

- [ ] ✅ `cors` instalado
- [ ] ✅ Variables de entorno configuradas en Heroku
- [ ] ✅ Frontend usa `credentials: 'include'`
- [ ] ✅ Backend desplegado en Heroku
- [ ] ✅ Endpoint `/cors-test` responde correctamente
- [ ] ✅ No hay errores en los logs de Heroku

## 🎯 **Resultado Esperado**

Después de la implementación, tu frontend debería poder hacer peticiones a:
- ✅ `POST /auth` (autenticación)
- ✅ `GET /health` (health check)
- ✅ `GET /cors-test` (test de CORS)
- ✅ Todos los endpoints de la API

¡Tu problema de CORS debería estar resuelto! 🎉 