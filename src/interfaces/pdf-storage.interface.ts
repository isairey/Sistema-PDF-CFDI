/**
 * Respuesta del almacenamiento de PDF
 */
export interface PDFStorageResponse {
  /** URL pública del PDF almacenado */
  url: string;
  /** Identificador único del archivo en el proveedor */
  publicId: string;
  /** Tamaño del archivo en bytes */
  size: number;
  /** Proveedor utilizado (cloudinary, local, s3, etc.) */
  provider: string;
}

/**
 * Interfaz para proveedores de almacenamiento de PDFs
 * Esta interfaz permite implementar diferentes proveedores de almacenamiento
 * manteniendo el principio de inversión de dependencias (SOLID)
 */
export interface IPDFStorageProvider {
  /**
   * Sube un PDF al proveedor de almacenamiento
   * @param pdfBuffer Buffer del PDF a subir
   * @param filename Nombre del archivo (sin extensión)
   * @returns Promise con la información del archivo almacenado
   */
  upload(pdfBuffer: Buffer, filename: string): Promise<PDFStorageResponse>;

  /**
   * Elimina un PDF del proveedor de almacenamiento
   * @param publicId Identificador único del archivo
   * @returns Promise<boolean> true si se eliminó correctamente
   */
  delete(publicId: string): Promise<boolean>;

  /**
   * Obtiene la URL pública de un PDF
   * @param publicId Identificador único del archivo
   * @returns URL pública del PDF
   */
  getPublicUrl(publicId: string): string;

  /**
   * Obtiene el nombre del proveedor
   * @returns Nombre del proveedor (cloudinary, local, s3, etc.)
   */
  getProviderName(): string;
}
