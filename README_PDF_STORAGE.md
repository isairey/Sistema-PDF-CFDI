# 📁 Sistema de Almacenamiento de PDFs

Este documento explica el nuevo sistema de almacenamiento de PDFs con soporte para múltiples proveedores.

## 🎯 Problema que Resuelve

**Antes**: Los PDFs se guardaban como buffers en MongoDB, lo que causaba:
- ❌ Base de datos muy pesada
- ❌ Rendimiento lento en consultas
- ❌ Problemas de escalabilidad
- ❌ Costos elevados de almacenamiento

**Ahora**: Los PDFs se almacenan en servicios especializados:
- ✅ Base de datos ligera (solo metadatos)
- ✅ Mejor rendimiento
- ✅ Escalabilidad horizontal
- ✅ Menores costos
- ✅ **Flexibilidad**: Elige tu proveedor favorito

## 🏗️ Arquitectura (Inversión de Dependencias)

El sistema utiliza el patrón **Strategy** con **Inversión de Dependencias** (principio SOLID):

```
┌─────────────────────────────────────┐
│      InvoiceService                 │
│  (No conoce el proveedor específico)│
└──────────────┬──────────────────────┘
               │ depende de
               ▼
┌─────────────────────────────────────┐
│   IPDFStorageProvider (Interface)   │
│  + upload()                          │
│  + delete()                          │
│  + getPublicUrl()                    │
└──────────────┬──────────────────────┘
               │ implementan
       ┌───────┼───────┬────────┐
       ▼       ▼       ▼        ▼
┌──────────┐ ┌────┐ ┌────┐ ┌────────┐
│Cloudinary│ │Local│ │ S3 │ │ Azure  │
│ Storage  │ │Storage│ │(TODO)│ │(TODO) │
└──────────┘ └────┘ └────┘ └────────┘
```

### ✅ Beneficios de esta Arquitectura

1. **Desacoplamiento**: El código de negocio no depende de un proveedor específico
2. **Extensibilidad**: Agregar nuevos proveedores es simple
3. **Testing**: Fácil crear mocks para pruebas
4. **Flexibilidad**: Cambiar de proveedor sin modificar código

## 🔧 Proveedores Disponibles

### 1. Cloudinary (Recomendado para Producción)

**Ventajas:**
- ✅ CDN global incluido
- ✅ Transformaciones automáticas
- ✅ Plan gratuito generoso
- ✅ Alta disponibilidad
- ✅ Sin mantenimiento de infraestructura

**Configuración:**
```env
PDF_STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**Obtener credenciales:**
1. Regístrate en [cloudinary.com](https://cloudinary.com)
2. Ve a Dashboard
3. Copia tus credenciales

### 2. Local Storage (Para Desarrollo/Testing)

**Ventajas:**
- ✅ Sin dependencias externas
- ✅ Ideal para desarrollo
- ✅ Sin costos adicionales
- ✅ Control total de los archivos

**Desventajas:**
- ❌ No escalable
- ❌ Sin CDN
- ❌ Requiere backups manuales

**Configuración:**
```env
PDF_STORAGE_PROVIDER=local
PDF_STORAGE_PATH=./storage/pdfs
PDF_BASE_URL=http://localhost:3000/pdfs
```

### 3. AWS S3 (Próximamente)

**Estado:** 🚧 No implementado
**Implementación:** Contribuciones bienvenidas

### 4. Azure Blob Storage (Próximamente)

**Estado:** 🚧 No implementado
**Implementación:** Contribuciones bienvenidas

## 📝 Uso del Sistema

### Automático (En el flujo de facturación)

El sistema se encarga automáticamente de subir los PDFs cuando el SRI confirma la recepción:

```typescript
// En InvoiceService.procesarEnvioSRI()
if (respuestaSRI.estado === 'RECIBIDA') {
  await this.generarPDFFactura(factura, empresa, cliente, productos, datosFactura);
  // ↑ Automáticamente usa el proveedor configurado
}
```

### Manual (Para casos específicos)

```typescript
import { PDFStorageFactory } from './services/storage';

// Obtener el proveedor configurado
const storage = PDFStorageFactory.create();

// Subir un PDF
const result = await storage.upload(pdfBuffer, 'factura_001_20240115');
console.log('PDF URL:', result.url);
console.log('Provider:', result.provider);

// Eliminar un PDF
const deleted = await storage.delete(result.publicId);

// Obtener URL pública
const url = storage.getPublicUrl(result.publicId);
```

### Usar un Proveedor Específico

```typescript
// Forzar uso de Cloudinary
const cloudinary = PDFStorageFactory.create('cloudinary');

// Forzar uso de Local Storage
const local = PDFStorageFactory.create('local');
```

## 🗄️ Modelo de Datos

El modelo `InvoicePDF` ahora almacena:

```typescript
{
  factura_id: "123",
  claveAcceso: "0101202301...",

  // Información del almacenamiento (SIN buffer)
  pdf_url: "https://res.cloudinary.com/.../factura.pdf",
  pdf_public_id: "facturas/factura_001_...",
  pdf_provider: "cloudinary",

  tamano_archivo: 245830,
  estado: "GENERADO",
  // ... otros campos
}
```

## 🔄 Migración de PDFs Existentes

Si ya tienes PDFs en la base de datos (con `pdf_buffer`), puedes migrarlos:

```typescript
// Ver: scripts/migrate-pdfs.ts (crear este script)
import InvoicePDF from './models/InvoicePDF';
import { PDFStorageFactory } from './services/storage';

async function migratePDFs() {
  const storage = PDFStorageFactory.create();

  // Encontrar PDFs antiguos que tienen buffer
  const oldPDFs = await InvoicePDF.find({
    pdf_buffer: { $exists: true }
  });

  for (const pdf of oldPDFs) {
    try {
      // Subir al nuevo sistema
      const result = await storage.upload(
        pdf.pdf_buffer,
        `factura_${pdf.factura_id}`
      );

      // Actualizar el documento
      pdf.pdf_url = result.url;
      pdf.pdf_public_id = result.publicId;
      pdf.pdf_provider = result.provider;
      pdf.pdf_buffer = undefined; // Eliminar buffer

      await pdf.save();
      console.log(`✅ Migrado: ${pdf.claveAcceso}`);
    } catch (error) {
      console.error(`❌ Error: ${pdf.claveAcceso}`, error);
    }
  }
}
```

## 🛠️ Crear un Nuevo Proveedor

Para agregar soporte para otro proveedor (ej: S3, Azure), sigue estos pasos:

### 1. Crear la implementación

```typescript
// src/services/storage/s3.storage.ts
import { IPDFStorageProvider, PDFStorageResponse } from '../../interfaces/pdf-storage.interface';
import AWS from 'aws-sdk';

export class S3PDFStorage implements IPDFStorageProvider {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.bucket = process.env.AWS_S3_BUCKET!;
  }

  async upload(pdfBuffer: Buffer, filename: string): Promise<PDFStorageResponse> {
    const key = `facturas/${filename}.pdf`;

    await this.s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    }).promise();

    return {
      url: `https://${this.bucket}.s3.amazonaws.com/${key}`,
      publicId: key,
      size: pdfBuffer.length,
      provider: 's3',
    };
  }

  async delete(publicId: string): Promise<boolean> {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucket,
        Key: publicId,
      }).promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  getPublicUrl(publicId: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${publicId}`;
  }

  getProviderName(): string {
    return 's3';
  }
}
```

### 2. Registrar en el Factory

```typescript
// src/services/storage/storage.factory.ts
import { S3PDFStorage } from './s3.storage';

// En el método create():
case 's3':
  console.log('📦 Usando proveedor de almacenamiento: AWS S3');
  provider = new S3PDFStorage();
  break;
```

### 3. Exportar en index.ts

```typescript
// src/services/storage/index.ts
export { S3PDFStorage } from './s3.storage';
```

### 4. Actualizar documentación

Agrega la configuración necesaria en `.env.example` y este README.

## 🧪 Testing

```typescript
import { PDFStorageFactory } from './services/storage';

describe('PDF Storage', () => {
  it('should upload PDF to configured provider', async () => {
    const storage = PDFStorageFactory.create();
    const buffer = Buffer.from('fake pdf content');

    const result = await storage.upload(buffer, 'test_invoice');

    expect(result.url).toBeDefined();
    expect(result.publicId).toBeDefined();
    expect(result.size).toBeGreaterThan(0);
  });
});
```

## 📊 Comparación de Costos (Ejemplo)

**Escenario:** 1000 facturas/mes, promedio 250KB por PDF

| Proveedor | Costo Mensual | CDN | Escalabilidad |
|-----------|---------------|-----|---------------|
| **MongoDB** (buffer) | $50-200 | ❌ | Limitada |
| **Cloudinary** | Gratis* | ✅ | Excelente |
| **AWS S3** | ~$0.50 | Opcional | Excelente |
| **Local** | $0 | ❌ | Manual |

*Plan gratuito: 25 GB almacenamiento, 25 GB ancho de banda

## 🤝 Contribuir

¿Quieres agregar soporte para otro proveedor?

1. Fork el repositorio
2. Implementa la interfaz `IPDFStorageProvider`
3. Agrega tests
4. Actualiza la documentación
5. Envía un Pull Request

## 📞 Soporte

- 🐛 **Bugs**: [Abrir un issue](https://github.com/XaviMontero/f-sri/issues)
- 💡 **Features**: [Discusiones](https://github.com/XaviMontero/f-sri/discussions)
- 📧 **Email**: [Contacto](mailto:tu@email.com)

---

**Nota**: Este sistema está en constante mejora. Contribuciones bienvenidas! 🚀
