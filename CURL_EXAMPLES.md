# 🌐 Ejemplos de cURL para Sistema de Facturación Electrónica

Esta guía contiene ejemplos prácticos de cURL para interactuar con la API del Sistema de Facturación Electrónica.

## 🔧 Configuración Base

```bash
# URL base del servidor (ajusta según tu configuración)
export BASE_URL="http://localhost:3000"

# Para usar en producción
# export BASE_URL="https://tu-sistema-facturacion.com"
```

## 🔐 Autenticación y Usuarios

### 1. Consultar Estado del Sistema

```bash
curl -X GET "$BASE_URL/status" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**
```json
{
  "firstRegistration": true,
  "registrationDisabled": false,
  "requiresInvitation": false,
  "masterKeyRequired": true
}
```

### 2. Primer Registro (Administrador)

```bash
curl -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "password123",
    "masterKey": "clave_maestra_configurada",
    "ruc": "1234567890001",
    "razon_social": "Empresa Ejemplo S.A.",
    "nombre_comercial": "Empresa Ejemplo",
    "direccion": "Av. Principal 123, Ciudad",
    "telefono": "0999999999",
    "codigo_establecimiento": "001",
    "punto_emision": "001",
    "tipo_ambiente": 1,
    "certificate": "LS0tLS1CRUdJTi...",
    "certificatePassword": "password_certificado"
  }'
```

### 3. Registro Posterior (con código de invitación)

```bash
curl -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "empleado@empresa.com",
    "password": "password123",
    "invitationCode": "INV2024001",
    "ruc": "0987654321001",
    "razon_social": "Segunda Empresa S.A.",
    "nombre_comercial": "Segunda Empresa",
    "certificate": "LS0tLS1CRUdJTi...",
    "certificatePassword": "password_certificado"
  }'
```

### 4. Autenticación (Login)

```bash
curl -X POST "$BASE_URL/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "admin@empresa.com"
  },
  "company": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "ruc": "1234567890001",
    "razon_social": "Empresa Ejemplo S.A.",
    "nombre_comercial": "Empresa Ejemplo"
  }
}
```

### 5. Guardar Token para Requests Posteriores

```bash
# Extraer y guardar el token
export TOKEN=$(curl -s -X POST "$BASE_URL/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "password123"
  }' | jq -r '.token')

echo "Token guardado: $TOKEN"
```

## 🧾 Facturación Electrónica

### 6. Crear Factura Completa

```bash
curl -X POST "$BASE_URL/api/v1/invoice/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "factura": {
      "infoTributaria": {
        "ruc": "1234567890001"
      },
      "infoFactura": {
        "fechaEmision": "17/12/2024",
        "tipoIdentificacionComprador": "05",
        "identificacionComprador": "0923456789",
        "razonSocialComprador": "Cliente Ejemplo",
        "totalSinImpuestos": "100.00",
        "importeTotal": "112.00"
      },
      "detalles": [
        {
          "detalle": {
            "codigoPrincipal": "P001",
            "descripcion": "Producto de Ejemplo",
            "cantidad": "1.00",
            "precioUnitario": "100.00",
            "precioTotalSinImpuesto": "100.00",
            "impuestos": [
              {
                "impuesto": {
                  "codigo": "2",
                  "codigoPorcentaje": "2",
                  "tarifa": "12.00",
                  "baseImponible": "100.00",
                  "valor": "12.00"
                }
              }
            ]
          }
        }
      ]
    }
  }'
```

### 7. Listar Facturas

```bash
curl -X GET "$BASE_URL/api/v1/invoice" \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Obtener Factura por ID

```bash
curl -X GET "$BASE_URL/api/v1/invoice/64f8a1b2c3d4e5f6a7b8c9d2" \
  -H "Authorization: Bearer $TOKEN"
```

## 📄 Gestión de PDFs

### 9. Listar PDFs de Facturas

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf" \
  -H "Authorization: Bearer $TOKEN"
```

### 10. Obtener PDF por ID de Factura

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf/factura/64f8a1b2c3d4e5f6a7b8c9d2" \
  -H "Authorization: Bearer $TOKEN"
```

### 11. Descargar PDF de Factura

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf/64f8a1b2c3d4e5f6a7b8c9d2/download" \
  -H "Authorization: Bearer $TOKEN" \
  -o "factura_001001000000001.pdf"
```

### 12. Obtener PDF por Clave de Acceso

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf/clave/1712202401123456789000110010010000000011234567890" \
  -H "Authorization: Bearer $TOKEN"
```

### 13. Regenerar PDF de Factura

```bash
curl -X POST "$BASE_URL/api/v1/invoice-pdf/regenerate/64f8a1b2c3d4e5f6a7b8c9d2" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "PDF regenerado exitosamente",
  "pdf": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
    "factura_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "claveAcceso": "1712202401123456789000110010010000000011234567890",
    "pdf_path": "/uploads/pdfs/factura_000000001_1712202401123456789000110010010000000011234567890.pdf",
    "tamano_archivo": 245760,
    "estado": "GENERADO",
    "fecha_generacion": "2024-12-17T10:30:00.000Z"
  }
}
```

### 14. Obtener información del PDF (sin descargar)

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf/64f8a1b2c3d4e5f6a7b8c9d8" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
  "factura_id": "64f8a1b2c3d4e5f6a7b8c9d2",
  "claveAcceso": "1712202401123456789000110010010000000011234567890",
  "pdf_path": "/uploads/pdfs/factura_000000001_1712202401123456789000110010010000000011234567890.pdf",
  "tamano_archivo": 245760,
  "numero_autorizacion": "1712202401123456789000110010010000000011234567890",
  "fecha_autorizacion": "2024-12-17T10:30:00.000Z",
  "estado": "GENERADO",
  "fecha_generacion": "2024-12-17T10:30:00.000Z",
  "createdAt": "2024-12-17T10:30:00.000Z",
  "updatedAt": "2024-12-17T10:30:00.000Z"
}
```

### 15. Descargar PDF con headers específicos

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf/64f8a1b2c3d4e5f6a7b8c9d8/download" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/pdf" \
  --output "factura.pdf" \
  --write-out "HTTP Status: %{http_code}\nContent-Type: %{content_type}\nSize: %{size_download} bytes\n"
```

### 16. Buscar PDFs por rango de fechas

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf?fechaInicio=2024-12-01&fechaFin=2024-12-31" \
  -H "Authorization: Bearer $TOKEN"
```

### 17. Buscar PDFs por estado

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf?estado=GENERADO" \
  -H "Authorization: Bearer $TOKEN"
```

### 18. Script para Descargar Todos los PDFs de un Día

```bash
#!/bin/bash

# Configuración
BASE_URL="http://localhost:3000"
FECHA="2024-12-17"
DOWNLOAD_DIR="./pdfs_$(date +%Y%m%d)"

echo "📥 Descargando PDFs del $FECHA..."

# Crear directorio de descarga
mkdir -p "$DOWNLOAD_DIR"

# Obtener lista de PDFs del día
PDFS=$(curl -s -X GET "$BASE_URL/api/v1/invoice-pdf?fechaInicio=${FECHA}&fechaFin=${FECHA}" \
  -H "Authorization: Bearer $TOKEN")

# Procesar cada PDF
echo "$PDFS" | grep -o '"_id":"[^"]*"' | sed 's/"_id":"\([^"]*\)"/\1/' | while read pdf_id; do
  if [ ! -z "$pdf_id" ]; then
    echo "Descargando PDF: $pdf_id"
    curl -s -X GET "$BASE_URL/api/v1/invoice-pdf/$pdf_id/download" \
      -H "Authorization: Bearer $TOKEN" \
      -o "$DOWNLOAD_DIR/factura_$pdf_id.pdf"
  fi
done

echo "✅ Descarga completada en: $DOWNLOAD_DIR"
```

### 19. Verificar Estado de Generación de PDFs

```bash
curl -X GET "$BASE_URL/api/v1/invoice-pdf?estado=ERROR" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta para PDFs con errores:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d9",
    "factura_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "claveAcceso": "1712202401123456789000110010010000000021234567890",
    "estado": "ERROR",
    "pdf_path": "",
    "tamano_archivo": 0,
    "fecha_generacion": "2024-12-17T10:30:00.000Z",
    "error_message": "Error al generar PDF: Datos de factura incompletos"
  }
]
```

### 20. Regenerar PDFs Fallidos

```bash
#!/bin/bash

echo "🔄 Regenerando PDFs fallidos..."

# Obtener PDFs con error
ERROR_PDFS=$(curl -s -X GET "$BASE_URL/api/v1/invoice-pdf?estado=ERROR" \
  -H "Authorization: Bearer $TOKEN")

# Regenerar cada PDF fallido
echo "$ERROR_PDFS" | grep -o '"factura_id":"[^"]*"' | sed 's/"factura_id":"\([^"]*\)"/\1/' | while read factura_id; do
  if [ ! -z "$factura_id" ]; then
    echo "Regenerando PDF para factura: $factura_id"
    curl -s -X POST "$BASE_URL/api/v1/invoice-pdf/regenerate/$factura_id" \
      -H "Authorization: Bearer $TOKEN"
  fi
done

echo "✅ Regeneración completada!"
```

## 🏢 Gestión de Empresas

### 21. Listar Empresas Emisoras

```bash
curl -X GET "$BASE_URL/api/v1/issuing-company" \
  -H "Authorization: Bearer $TOKEN"
```

### 22. Obtener Empresa por ID

```bash
curl -X GET "$BASE_URL/api/v1/issuing-company/64f8a1b2c3d4e5f6a7b8c9d1" \
  -H "Authorization: Bearer $TOKEN"
```

### 23. Actualizar Empresa

```bash
curl -X PUT "$BASE_URL/api/v1/issuing-company/64f8a1b2c3d4e5f6a7b8c9d1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "telefono": "0999888777",
    "email": "facturacion@empresa.com"
  }'
```

## 👥 Gestión de Clientes

### 24. Crear Cliente

```bash
curl -X POST "$BASE_URL/api/v1/client" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tipo_identificacion_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "identificacion": "0923456789",
    "razon_social": "Cliente Ejemplo",
    "email": "cliente@email.com",
    "telefono": "0999123456",
    "direccion": "Av. Secundaria 456, Ciudad"
  }'
```

### 25. Listar Clientes

```bash
curl -X GET "$BASE_URL/api/v1/client" \
  -H "Authorization: Bearer $TOKEN"
```

### 26. Actualizar Cliente

```bash
curl -X PUT "$BASE_URL/api/v1/client/64f8a1b2c3d4e5f6a7b8c9d4" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "telefono": "0999654321",
    "email": "nuevo@cliente.com"
  }'
```

## 📦 Gestión de Productos

### 27. Crear Producto

```bash
curl -X POST "$BASE_URL/api/v1/product" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "codigo": "P001",
    "descripcion": "Producto de Ejemplo",
    "precio_unitario": 850.00,
    "tiene_iva": true,
    "categoria": "General"
  }'
```

### 28. Listar Productos

```bash
curl -X GET "$BASE_URL/api/v1/product" \
  -H "Authorization: Bearer $TOKEN"
```

### 29. Actualizar Producto

```bash
curl -X PUT "$BASE_URL/api/v1/product/64f8a1b2c3d4e5f6a7b8c9d5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "precio_unitario": 900.00,
    "descripcion": "Producto de Ejemplo Actualizado"
  }'
```

## 🆔 Tipos de Identificación

### 30. Crear Tipos de Identificación Básicos de Ecuador

```bash
# Crear Cédula
curl -X POST "$BASE_URL/api/v1/identification-type" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "codigo": "05",
    "descripcion": "CEDULA"
  }'

# Crear RUC
curl -X POST "$BASE_URL/api/v1/identification-type" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "codigo": "04",
    "descripcion": "RUC"
  }'

# Crear Pasaporte
curl -X POST "$BASE_URL/api/v1/identification-type" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "codigo": "06",
    "descripcion": "PASAPORTE"
  }'

# Crear Consumidor Final
curl -X POST "$BASE_URL/api/v1/identification-type" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "codigo": "07",
    "descripcion": "CONSUMIDOR FINAL"
  }'

# Crear Identificación del Exterior
curl -X POST "$BASE_URL/api/v1/identification-type" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "codigo": "08",
    "descripcion": "IDENTIFICACION DEL EXTERIOR"
  }'
```

### 31. Script para Crear Todos los Tipos de Identificación

```bash
#!/bin/bash

# Configuración
BASE_URL="http://localhost:3000"

echo "🆔 Creando tipos de identificación de Ecuador..."

# Array con los tipos de identificación
declare -a tipos=(
  '{"codigo": "04", "descripcion": "RUC"}'
  '{"codigo": "05", "descripcion": "CEDULA"}'
  '{"codigo": "06", "descripcion": "PASAPORTE"}'
  '{"codigo": "07", "descripcion": "CONSUMIDOR FINAL"}'
  '{"codigo": "08", "descripcion": "IDENTIFICACION DEL EXTERIOR"}'
)

# Crear cada tipo
for tipo in "${tipos[@]}"; do
  echo "Creando: $tipo"
  curl -s -X POST "$BASE_URL/api/v1/identification-type" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$tipo" | jq
  echo "---"
done

echo "✅ Tipos de identificación creados!"
```

### 32. Listar Tipos de Identificación

```bash
curl -X GET "$BASE_URL/api/v1/identification-type" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "codigo": "04",
    "descripcion": "RUC"
  },
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "codigo": "05",
    "descripcion": "CEDULA"
  },
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "codigo": "06",
    "descripcion": "PASAPORTE"
  },
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
    "codigo": "07",
    "descripcion": "CONSUMIDOR FINAL"
  },
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "codigo": "08",
    "descripcion": "IDENTIFICACION DEL EXTERIOR"
  }
]
```

## 🔍 Ejemplos de Respuestas de Error

### Error de Autenticación (401)

```bash
curl -X GET "$BASE_URL/api/v1/invoice" \
  -H "Authorization: Bearer token_invalido"
```

**Respuesta:**
```json
{
  "message": "Token inválido"
}
```

### Error de Validación (400)

```bash
curl -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email_invalido",
    "password": "123"
  }'
```

**Respuesta:**
```json
{
  "message": "Email y contraseña son requeridos"
}
```

### Error de Permisos (403)

```bash
curl -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123",
    "ruc": "1234567890001",
    "razon_social": "Test Company"
  }'
```

**Respuesta:**
```json
{
  "message": "Clave maestra requerida para el primer registro"
}
```

## 🧪 Scripts de Testing

### Script Completo de Prueba

```bash
#!/bin/bash

# Configuración
BASE_URL="http://localhost:3000"

echo "🚀 Iniciando pruebas del Sistema de Facturación Electrónica..."

# 1. Verificar estado del sistema
echo "📊 Consultando estado del sistema..."
curl -s "$BASE_URL/status" | jq

# 2. Registrar primer usuario
echo "👤 Registrando primer usuario..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "masterKey": "test_master_key",
    "ruc": "1234567890001",
    "razon_social": "Empresa Test S.A.",
    "certificate": "dGVzdF9jZXJ0aWZpY2F0ZQ=="
  }')

echo $REGISTER_RESPONSE | jq

# 3. Extraer token
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo "🔑 Token obtenido: ${TOKEN:0:20}..."

# 4. Crear tipos de identificación
echo "🆔 Creando tipos de identificación..."
declare -a tipos=(
  '{"codigo": "04", "descripcion": "RUC"}'
  '{"codigo": "05", "descripcion": "CEDULA"}'
  '{"codigo": "06", "descripcion": "PASAPORTE"}'
  '{"codigo": "07", "descripcion": "CONSUMIDOR FINAL"}'
  '{"codigo": "08", "descripcion": "IDENTIFICACION DEL EXTERIOR"}'
)

for tipo in "${tipos[@]}"; do
  curl -s -X POST "$BASE_URL/api/v1/identification-type" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$tipo" > /dev/null
done

# Obtener ID del tipo de identificación CEDULA
CEDULA_ID=$(curl -s -X GET "$BASE_URL/api/v1/identification-type" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.codigo=="05") | ._id')

echo "📋 ID de CEDULA obtenido: $CEDULA_ID"

# 5. Crear cliente
echo "👥 Creando cliente..."
curl -s -X POST "$BASE_URL/api/v1/client" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"tipo_identificacion_id\": \"$CEDULA_ID\",
    \"identificacion\": \"0923456789\",
    \"razon_social\": \"Cliente Test\",
    \"email\": \"cliente@test.com\",
    \"telefono\": \"0999123456\"
  }" | jq

# 6. Crear producto
echo "📦 Creando producto..."
curl -s -X POST "$BASE_URL/api/v1/product" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "codigo": "P001",
    "descripcion": "Producto Test",
    "precio_unitario": 100.00,
    "tiene_iva": true
  }' | jq

# 7. Crear factura completa
echo "🧾 Creando factura completa..."
FACTURA_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/invoice/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "factura": {
      "infoTributaria": {
        "ruc": "1234567890001"
      },
      "infoFactura": {
        "fechaEmision": "17/12/2024",
        "tipoIdentificacionComprador": "05",
        "identificacionComprador": "0923456789",
        "razonSocialComprador": "Cliente Test",
        "totalSinImpuestos": "100.00",
        "importeTotal": "112.00"
      },
      "detalles": [
        {
          "detalle": {
            "codigoPrincipal": "P001",
            "descripcion": "Producto Test",
            "cantidad": "1.00",
            "precioUnitario": "100.00",
            "precioTotalSinImpuesto": "100.00",
            "impuestos": [
              {
                "impuesto": {
                  "codigo": "2",
                  "codigoPorcentaje": "2",
                  "tarifa": "12.00",
                  "baseImponible": "100.00",
                  "valor": "12.00"
                }
              }
            ]
          }
        }
      ]
    }
  }')

echo $FACTURA_RESPONSE

# Extraer ID de la factura creada
FACTURA_ID=$(echo $FACTURA_RESPONSE | grep -o '"_id":"[^"]*"' | head -1 | sed 's/"_id":"\([^"]*\)"/\1/')
echo "📋 ID de factura creada: $FACTURA_ID"

# 8. Esperar un momento para que se procese
echo "⏳ Esperando procesamiento de factura (30 segundos)..."
sleep 30

# 9. Verificar estado de la factura
echo "🔍 Verificando estado de la factura..."
curl -s -X GET "$BASE_URL/api/v1/invoice/$FACTURA_ID" \
  -H "Authorization: Bearer $TOKEN"

# 10. Buscar PDF generado
echo "📄 Buscando PDF generado..."
curl -s -X GET "$BASE_URL/api/v1/invoice-pdf/factura/$FACTURA_ID" \
  -H "Authorization: Bearer $TOKEN"

# 11. Descargar PDF si existe
PDF_INFO=$(curl -s -X GET "$BASE_URL/api/v1/invoice-pdf/factura/$FACTURA_ID" \
  -H "Authorization: Bearer $TOKEN")

PDF_ID=$(echo $PDF_INFO | grep -o '"_id":"[^"]*"' | head -1 | sed 's/"_id":"\([^"]*\)"/\1/')

if [ ! -z "$PDF_ID" ]; then
  echo "📥 Descargando PDF: $PDF_ID"
  curl -s -X GET "$BASE_URL/api/v1/invoice-pdf/$PDF_ID/download" \
    -H "Authorization: Bearer $TOKEN" \
    -o "test_factura.pdf"
  
  if [ -f "test_factura.pdf" ]; then
    echo "✅ PDF descargado exitosamente: test_factura.pdf ($(du -h test_factura.pdf | cut -f1))"
  else
    echo "❌ Error al descargar PDF"
  fi
else
  echo "⚠️ PDF no encontrado, puede estar aún procesándose"
fi

echo "✅ Pruebas completadas!"
echo "📊 Resumen:"
echo "  - Usuario y empresa creados"
echo "  - Tipos de identificación configurados"
echo "  - Cliente y producto creados"
echo "  - Factura electrónica generada"
echo "  - PDF generado y descargado (si SRI = RECIBIDA)"
echo ""
echo "📁 Archivos generados:"
echo "  - test_factura.pdf (si existe)"
echo ""
echo "🔍 Para verificar:"
echo "  - Estado de factura: curl -H \"Authorization: Bearer \$TOKEN\" \$BASE_URL/api/v1/invoice/\$FACTURA_ID"
echo "  - PDF disponible: curl -H \"Authorization: Bearer \$TOKEN\" \$BASE_URL/api/v1/invoice-pdf/factura/\$FACTURA_ID"
```

### Guardar y Ejecutar

```bash
# Guardar el script
chmod +x test_api.sh

# Ejecutar
./test_api.sh
```

## 📚 Documentación Adicional

- **API Documentation**: `http://localhost:3000/api-docs`
- **Postman Collection**: Importa estos cURLs a Postman
- **Insomnia**: Compatible con formato REST Client

---

**💡 Tip**: Usa `jq` para formatear las respuestas JSON de manera legible.

```bash
# Instalar jq en Ubuntu/Debian
sudo apt install jq

# Instalar jq en macOS
brew install jq

# Instalar jq en Windows
choco install jq
```

## 🚀 Flujo Completo de Facturación con PDF

### Proceso Automático
1. **Crear Factura** → Se genera XML
2. **Firmar Digitalmente** → Se firma con certificado P12
3. **Enviar al SRI** → Se valida en el servicio web del SRI
4. **Estado RECIBIDA** → Se genera PDF automáticamente
5. **PDF Disponible** → Se puede descargar via API

### Monitoreo con Logs
```bash
# Ver logs del servidor para monitorear el proceso
tail -f logs/app.log | grep "FACTURA RECIBIDA POR SRI"
```

**Ejemplo de log exitoso:**
```
✅ FACTURA RECIBIDA POR SRI - ID: 64f8a1b2c3d4e5f6a7b8c9d2, Clave: 1712202401123456789000110010010000000011234567890, Secuencial: 000000001
```