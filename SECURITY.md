# 🔒 Guía de Seguridad - F Sri

## 🛡️ Sistema de Registro Seguro

F Sri implementa un sistema de registro de múltiples capas para proteger contra registros no autorizados.

## 🔐 Estrategias de Seguridad Implementadas

### 1. **Primer Registro (Clave Maestra)**
- El **primer registro** en el sistema requiere una `MASTER_REGISTRATION_KEY`
- Esta clave debe configurarse en las variables de entorno antes del despliegue
- Solo quien tenga acceso al servidor puede realizar el primer registro

### 2. **Registros Posteriores (Códigos de Invitación)**
- Después del primer registro, se requieren **códigos de invitación**
- Los códigos se configuran en `INVITATION_CODES`
- Cada código puede usarse múltiples veces (configurable)

### 3. **Whitelist de RUCs**
- Lista de RUCs pre-aprobados en `ALLOWED_RUCS`
- Solo empresas con RUCs en esta lista pueden registrarse
- Útil para ambientes controlados

### 4. **Deshabilitar Registro**
- Variable `DISABLE_REGISTRATION=true` bloquea todos los registros
- Útil después de configurar todas las empresas necesarias

## ⚙️ Configuración de Variables de Entorno

```env
# Clave maestra para el primer registro (OBLIGATORIA)
MASTER_REGISTRATION_KEY=tu_clave_super_secreta_aqui

# Códigos de invitación (opcional)
INVITATION_CODES=INV2024001,INV2024002,DEMO2024

# RUCs permitidos (opcional)
ALLOWED_RUCS=1234567890001,0987654321001

# Deshabilitar registro completamente (opcional)
DISABLE_REGISTRATION=false
```

## 🚀 Flujo de Registro

### Primer Registro
```json
POST /register
{
  "email": "admin@empresa.com",
  "password": "password123",
  "masterKey": "tu_clave_super_secreta_aqui",
  "ruc": "1234567890001",
  "razon_social": "Mi Empresa S.A.",
  "nombre_comercial": "Mi Empresa",
  "certificate": "base64_del_certificado",
  "certificatePassword": "password_del_certificado"
}
```

### Registros Posteriores
```json
POST /register
{
  "email": "usuario@empresa.com",
  "password": "password123",
  "invitationCode": "INV2024001",
  "ruc": "0987654321001",
  "razon_social": "Otra Empresa S.A.",
  "nombre_comercial": "Otra Empresa",
  "certificate": "base64_del_certificado",
  "certificatePassword": "password_del_certificado"
}
```

## 🔍 Endpoint de Estado

Consulta el estado del sistema:

```bash
GET /status
```

Respuesta:
```json
{
  "firstRegistration": false,
  "registrationDisabled": false,
  "requiresInvitation": true,
  "masterKeyRequired": false
}
```

## 🛠️ Escenarios de Configuración

### 1. **Empresa Individual (Máxima Seguridad)**
```env
MASTER_REGISTRATION_KEY=clave_super_secreta
DISABLE_REGISTRATION=true  # Después del primer registro
```

### 2. **Múltiples Empresas Controladas**
```env
MASTER_REGISTRATION_KEY=clave_super_secreta
ALLOWED_RUCS=1234567890001,0987654321001,1122334455001
```

### 3. **Sistema con Invitaciones**
```env
MASTER_REGISTRATION_KEY=clave_super_secreta
INVITATION_CODES=INV2024001,INV2024002,DEMO2024
```

### 4. **Ambiente de Desarrollo**
```env
MASTER_REGISTRATION_KEY=dev_key_123
INVITATION_CODES=DEV001,TEST001
```

## ⚠️ Recomendaciones de Seguridad

### 🔒 **Producción**
1. **Usa claves fuertes** para `MASTER_REGISTRATION_KEY`
2. **Cambia las claves** después del primer registro
3. **Deshabilita el registro** cuando no sea necesario
4. **Usa HTTPS** siempre en producción
5. **Configura CORS** correctamente

### 🧪 **Desarrollo**
1. Usa claves simples pero únicas
2. Documenta las claves en el equipo
3. No uses las mismas claves que producción

### 🔄 **Mantenimiento**
1. **Rota códigos de invitación** periódicamente
2. **Audita registros** regularmente
3. **Monitorea intentos** de registro fallidos

## 🚨 Respuestas de Error

### Primer Registro sin Clave Maestra
```json
{
  "message": "Clave maestra requerida para el primer registro"
}
```

### Código de Invitación Inválido
```json
{
  "message": "Código de invitación inválido o RUC no autorizado"
}
```

### Registro Deshabilitado
```json
{
  "message": "Registro deshabilitado por el administrador"
}
```

### RUC Duplicado
```json
{
  "message": "Empresa con este RUC ya está registrada"
}
```

## 🔧 Troubleshooting

### Problema: "Sistema no configurado para registro inicial"
**Solución**: Configura `MASTER_REGISTRATION_KEY` en las variables de entorno

### Problema: No puedo registrar después del primer usuario
**Solución**: Configura `INVITATION_CODES` o `ALLOWED_RUCS`

### Problema: Error de formato de RUC
**Solución**: El RUC debe tener 13 dígitos y terminar en 001

## 📞 Soporte

Si tienes problemas de seguridad:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Consulta este documento
4. Abre un issue en GitHub

---

**⚠️ Importante**: Nunca compartas las claves maestras o códigos de invitación públicamente. 