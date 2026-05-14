export interface ProductDetail {
  detalle: {
    codigoPrincipal: string;
    descripcion: string;
    cantidad: string;
    precioUnitario: string;
    precioTotalSinImpuesto: string;
    impuestos: Array<{
      impuesto: {
        codigo: string;
        codigoPorcentaje: string;
        tarifa: string;
        baseImponible: string;
        valor: string;
      };
    }>;
  };
}

export interface InvoiceInfo {
  fechaEmision: string;
  tipoIdentificacionComprador: string;
  identificacionComprador: string;
  razonSocialComprador: string;
  totalSinImpuestos: string;
  importeTotal: string;
}

export interface TaxInfo {
  ruc: string;
  claveAcceso: string;
  secuencial: string;
}

export interface InvoiceRequest {
  infoTributaria: TaxInfo;
  infoFactura: InvoiceInfo;
  detalles: ProductDetail[];
}

export interface CreateInvoiceDTO {
  empresaId: string | any;
  clienteId: string | any;
  fechaEmision: Date;
  claveAcceso: string;
  secuencial: string;
  totalSinImpuestos: number;
  totalIva: number;
  totalConImpuestos: number;
}

export interface AccessKeyDTO {
  fecha: Date;
  tipoComprobante: string;
  ruc: string;
  ambiente: string;
  serie: string;
  secuencial: string;
  codigoNumerico: string;
  tipoEmision: string;
}
