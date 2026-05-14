import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/testApp';

// Mock puppeteer before any imports that might use it
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setViewport: jest.fn(),
      setContent: jest.fn(),
      pdf: jest.fn().mockResolvedValue(Buffer.from('fake-pdf-content')),
    }),
    close: jest.fn(),
  }),
}));

// Mock PDF utilities
jest.mock('../src/utils/pdf.utils', () => ({
  generateInvoicePDF: jest.fn().mockResolvedValue(Buffer.from('mock-pdf-content')),
  savePDFToFile: jest.fn().mockResolvedValue('/tmp/mock-file.pdf'),
}));

// Mock InvoicePDF model
const invoicePDFInstanceMocks = {
  save: jest.fn().mockResolvedValue({}),
};
jest.mock('../src/models/InvoicePDF', () => {
  class MockInvoicePDF {
    constructor(public data: any) {}
    save = invoicePDFInstanceMocks.save;
  }
  return { __esModule: true, default: MockInvoicePDF };
});

// --- Helper to create method mocks ---
function createModelInstanceMocks() {
  return {
    save: jest.fn().mockResolvedValue({}),
    // Add other common instance methods here if you need them
  };
}

function createModelStaticMocks() {
  return {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null), // Default to null for findOne
    findById: jest.fn().mockResolvedValue(null), // Default to null for findById
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
    findByIdAndDelete: jest.fn().mockResolvedValue({}),
    // Add other common static methods here
  };
}

// Helper to create mock objects with toObject method
function createMockWithToObject(data: any) {
  return {
    ...data,
    toObject: function () {
      return { ...this };
    },
  };
}

// Function to mock the save methods
function mockSaveWithToObject() {
  return function (this: any) {
    if (!this.toObject) {
      this.toObject = function () {
        return { ...this };
      };
    }
    return Promise.resolve(this);
  };
}

// --- User Mock ---
const userInstanceMocks = createModelInstanceMocks();
const userStaticMocks = createModelStaticMocks();
jest.mock('../src/models/User', () => {
  class MockUser {
    email: string;
    password: string;
    constructor(data: any) {
      this.email = data.email;
      this.password = data.password;
    }
    save = userInstanceMocks.save;
    static get findOne() {
      return userStaticMocks.findOne;
    }
  }
  return { __esModule: true, default: MockUser };
});
const UserControl = {
  ...userInstanceMocks,
  ...userStaticMocks,
  getConstructor: () => jest.requireMock('../src/models/User').default,
};

// --- IdentificationType Mock ---
const identificationTypeInstanceMocks = createModelInstanceMocks();
const identificationTypeStaticMocks = createModelStaticMocks();
jest.mock('../src/models/IdentificationType', () => {
  class MockIdentificationType {
    constructor(public data: any) {}
    save = identificationTypeInstanceMocks.save;
    static get find() {
      return identificationTypeStaticMocks.find;
    }
    static get findOne() {
      return identificationTypeStaticMocks.findOne;
    }
    static get findById() {
      return identificationTypeStaticMocks.findById;
    }
    static get findByIdAndUpdate() {
      return identificationTypeStaticMocks.findByIdAndUpdate;
    }
    static get findByIdAndDelete() {
      return identificationTypeStaticMocks.findByIdAndDelete;
    }
  }
  return { __esModule: true, default: MockIdentificationType };
});
const identificationType = {
  // Renamed from 'identificationTypeControl' to match the original usage
  ...identificationTypeInstanceMocks,
  ...identificationTypeStaticMocks,
  getConstructor: () => jest.requireMock('../src/models/IdentificationType').default,
  // Keeping 'class' as getter if any test uses it explicitly like this.
  // It's safer to use getConstructor().
  get class() {
    return jest.requireMock('../src/models/IdentificationType').default;
  },
};

// --- IssuingCompany Mock ---
const issuingCompanyInstanceMocks = createModelInstanceMocks();
const issuingCompanyStaticMocks = createModelStaticMocks();
jest.mock('../src/models/IssuingCompany', () => {
  class MockIssuingCompany {
    constructor(public data: any) {}
    save = issuingCompanyInstanceMocks.save;
    static get find() {
      return issuingCompanyStaticMocks.find;
    }
    static get findOne() {
      return issuingCompanyStaticMocks.findOne;
    }
    static get findById() {
      return issuingCompanyStaticMocks.findById;
    }
    static get findByIdAndUpdate() {
      return issuingCompanyStaticMocks.findByIdAndUpdate;
    }
    static get findByIdAndDelete() {
      return issuingCompanyStaticMocks.findByIdAndDelete;
    }
  }
  return { __esModule: true, default: MockIssuingCompany };
});
const issuingCompany = {
  // Renamed to match the original usage
  ...issuingCompanyInstanceMocks,
  ...issuingCompanyStaticMocks,
  getConstructor: () => jest.requireMock('../src/models/IssuingCompany').default,
  get class() {
    return jest.requireMock('../src/models/IssuingCompany').default;
  },
};

// --- Client Mock ---
const clientInstanceMocks = createModelInstanceMocks();
const clientStaticMocks = createModelStaticMocks();
jest.mock('../src/models/Client', () => {
  class MockClient {
    constructor(public data: any) {}
    save = clientInstanceMocks.save;
    static get find() {
      return clientStaticMocks.find;
    }
    static get findOne() {
      return clientStaticMocks.findOne;
    }
    static get findById() {
      return clientStaticMocks.findById;
    }
    static get findByIdAndUpdate() {
      return clientStaticMocks.findByIdAndUpdate;
    }
    static get findByIdAndDelete() {
      return clientStaticMocks.findByIdAndDelete;
    }
  }
  return { __esModule: true, default: MockClient };
});
const client = {
  // Renamed to match the original usage
  ...clientInstanceMocks,
  ...clientStaticMocks,
  getConstructor: () => jest.requireMock('../src/models/Client').default,
  get class() {
    return jest.requireMock('../src/models/Client').default;
  },
};

// --- Product Mock ---
const productInstanceMocks = createModelInstanceMocks();
const productStaticMocks = createModelStaticMocks();
jest.mock('../src/models/Product', () => {
  class MockProduct {
    constructor(public data: any) {}
    save = productInstanceMocks.save;
    static get find() {
      return productStaticMocks.find;
    }
    static get findOne() {
      return productStaticMocks.findOne;
    }
    static get findById() {
      return productStaticMocks.findById;
    }
    static get findByIdAndUpdate() {
      return productStaticMocks.findByIdAndUpdate;
    }
    static get findByIdAndDelete() {
      return productStaticMocks.findByIdAndDelete;
    }
  }
  return { __esModule: true, default: MockProduct };
});
const product = {
  // Renamed to match the original usage
  ...productInstanceMocks,
  ...productStaticMocks,
  getConstructor: () => jest.requireMock('../src/models/Product').default,
  get class() {
    return jest.requireMock('../src/models/Product').default;
  },
};

// --- Invoice Mock ---
const invoiceInstanceMocks = createModelInstanceMocks();
const invoiceStaticMocks = createModelStaticMocks();
jest.mock('../src/models/Invoice', () => {
  class MockInvoice {
    constructor(public data: any) {}
    save = invoiceInstanceMocks.save;
    static get find() {
      return invoiceStaticMocks.find;
    }
    static get findOne() {
      return invoiceStaticMocks.findOne;
    }
    static get findById() {
      return invoiceStaticMocks.findById;
    }
    static get findByIdAndUpdate() {
      return invoiceStaticMocks.findByIdAndUpdate;
    }
    static get findByIdAndDelete() {
      return invoiceStaticMocks.findByIdAndDelete;
    }
  }
  return { __esModule: true, default: MockInvoice };
});
const invoice = {
  // Renamed to match the original usage
  ...invoiceInstanceMocks,
  ...invoiceStaticMocks,
  getConstructor: () => jest.requireMock('../src/models/Invoice').default,
  get class() {
    return jest.requireMock('../src/models/Invoice').default;
  },
};

// --- InvoiceDetail Mock ---
const invoiceDetailInstanceMocks = createModelInstanceMocks();
const invoiceDetailStaticMocks = createModelStaticMocks();
jest.mock('../src/models/InvoiceDetail', () => {
  class MockInvoiceDetail {
    constructor(public data: any) {}
    save = invoiceDetailInstanceMocks.save;
    static get find() {
      return invoiceDetailStaticMocks.find;
    }
    static get findOne() {
      return invoiceDetailStaticMocks.findOne;
    }
    static get findById() {
      return invoiceDetailStaticMocks.findById;
    }
    static get findByIdAndUpdate() {
      return invoiceDetailStaticMocks.findByIdAndUpdate;
    }
    static get findByIdAndDelete() {
      return invoiceDetailStaticMocks.findByIdAndDelete;
    }
  }
  return { __esModule: true, default: MockInvoiceDetail };
});
const invoiceDetail = {
  // Renamed to match the original usage
  ...invoiceDetailInstanceMocks,
  ...invoiceDetailStaticMocks,
  getConstructor: () => jest.requireMock('../src/models/InvoiceDetail').default,
  get class() {
    return jest.requireMock('../src/models/InvoiceDetail').default;
  },
};

process.env.JWT_SECRET = 'secret';
process.env.ENCRYPTION_KEY = 'test_encryption_key_32_bytes_long!!';
const token = jwt.sign({ userId: '1' }, process.env.JWT_SECRET);
const authHeader = `Bearer ${token}`;
const app = createApp();

// File system mock for tests
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn().mockImplementation((path) => {
    if (path.includes('oscar.p12')) {
      return Buffer.from('CERTIFICADO_MOCK_PARA_PRUEBAS');
    }
    return jest.requireActual('fs').readFileSync(path);
  }),
  existsSync: jest.fn().mockImplementation((path) => {
    if (path.includes('.p12')) {
      return true; // We simulate that the certificate file exists
    }
    return jest.requireActual('fs').existsSync(path);
  }),
}));

describe('Auth endpoints', () => {
  beforeEach(() => {
    // Reset mocks for User before each auth test
    UserControl.findOne.mockResolvedValue(null); // Default to user not found
    UserControl.save.mockClear(); // Clear previous save calls
    userStaticMocks.findOne.mockResolvedValue({ password: 'hashed', _id: '1' });

    // Mock IssuingCompany for registration tests
    issuingCompany.findOne.mockResolvedValue(null); // No existing company
    issuingCompany.save.mockImplementation(mockSaveWithToObject());

    // Mock environment variables for security
    process.env.MASTER_REGISTRATION_KEY = 'test_master_key';

    // Mock User and IssuingCompany countDocuments for first registration check
    const UserMock = jest.requireMock('../src/models/User').default;
    const IssuingCompanyMock = jest.requireMock('../src/models/IssuingCompany').default;
    UserMock.countDocuments = jest.fn().mockResolvedValue(0); // First registration
    IssuingCompanyMock.countDocuments = jest.fn().mockResolvedValue(0); // First registration
  });

  it('registers a user', async () => {
    userStaticMocks.findOne.mockResolvedValueOnce(null); // Ensure user doesn't exist for registration
    userInstanceMocks.save.mockResolvedValueOnce({ _id: '1', email: 'a@b.c' }); // Mock save result
    issuingCompany.findOne.mockResolvedValueOnce(null); // No existing company

    const registrationData = {
      email: 'a@b.c',
      password: 'pass',
      ruc: '1234567890001',
      razon_social: 'Test Company',
      masterKey: 'test_master_key',
      certificate: 'MIIJqQIBAzCCCW8GCSqGSIb3DQEHAaCCCWAEgglcMIIJWDCCBW8GCSqGSIb3', // Mock base64 certificate
      certificate_password: 'test_cert_password',
    };

    const res = await request(app).post('/register').send(registrationData);
    expect(res.status).toBe(201);
    expect(userInstanceMocks.save).toHaveBeenCalled();
    expect(issuingCompany.save).toHaveBeenCalled();
  });

  it('authenticates a user', async () => {
    const tokenRes = 'token';
    // Mock bcrypt comparison
    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

    // Ensure that the User.findOne mock resolves to the expected user for authentication
    userStaticMocks.findOne.mockResolvedValueOnce({
      password: '$2a$10$hashedPassword',
      _id: 'userId123',
      email: 'a@b.c',
    });

    // Mock company lookup
    issuingCompany.findOne.mockResolvedValueOnce({
      _id: 'companyId1',
      ruc: '1234567890001',
      razon_social: 'Test Company',
      nombre_comercial: 'Test Company',
    });

    // Mock jwt.sign
    jest.spyOn(require('jsonwebtoken'), 'sign').mockReturnValueOnce(tokenRes as any);

    const res = await request(app).post('/auth').send({ email: 'a@b.c', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBe(tokenRes);
    expect(userStaticMocks.findOne).toHaveBeenCalledWith({ email: 'a@b.c' });
  });
});

describe('CRUD endpoints', () => {
  beforeEach(() => {
    // Reset relevant mocks, e.g., for identification-type
    identificationType.findById.mockResolvedValue({ _id: '1', data: 'test' }); // Mock for findById
    identificationType.findOne.mockResolvedValue({ _id: '1', data: 'test' });
    identificationType.find.mockResolvedValue([{ _id: '1', data: 'test' }]);
    identificationType.save.mockClear();
    identificationType.findByIdAndUpdate.mockClear();
    identificationType.findByIdAndDelete.mockClear();
    // ... and for other models if necessary
  });

  it('creates identification-type', async () => {
    identificationType.save.mockResolvedValueOnce({ _id: 'newId', code: '01', name: 'Cedula' });
    const res = await request(app)
      .post('/api/v1/identification-type')
      .set('Authorization', authHeader)
      .send({ code: '01', name: 'Cedula' });
    expect(res.status).toBe(201);
    expect(identificationType.save).toHaveBeenCalled();
  });
  it('gets identification-type list', async () => {
    const res = await request(app).get('/api/v1/identification-type').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(identificationType.find).toHaveBeenCalled();
  });
  it('gets identification-type by id', async () => {
    const res = await request(app).get('/api/v1/identification-type/1').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(identificationType.findById).toHaveBeenCalledWith('1');
  });
  it('updates identification-type', async () => {
    identificationType.findByIdAndUpdate.mockResolvedValueOnce({ _id: '1', code: '01', name: 'Cedula Actualizada' });
    const res = await request(app)
      .put('/api/v1/identification-type/1')
      .set('Authorization', authHeader)
      .send({ name: 'Cedula Actualizada' });
    expect(res.status).toBe(200);
    expect(identificationType.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { name: 'Cedula Actualizada' },
      { new: true },
    );
  });
  it('deletes identification-type', async () => {
    identificationType.findByIdAndDelete.mockResolvedValueOnce({ _id: '1' });
    const res = await request(app).delete('/api/v1/identification-type/1').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(identificationType.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});

// Similar tests could be added for other endpoints

describe('Factura complete endpoint', () => {
  const payload = {
    factura: {
      infoTributaria: {
        ruc: '1799999999001',
        claveAcceso: '1', // Este campo no parece usarse en el servicio para generar la clave
        secuencial: '123', // Este secuencial se genera en el servicio
      },
      infoFactura: {
        fechaEmision: '17/05/2025',
        tipoIdentificacionComprador: '05', // Cedula
        identificacionComprador: '0923456789',
        totalSinImpuestos: '100',
        importeTotal: '112', // Usado para totalConImpuestos
      },
      detalles: [
        {
          detalle: {
            codigoPrincipal: 'P001',
            cantidad: '1',
            precioUnitario: '100',
            precioTotalSinImpuesto: '100', // Usado para subtotal
            impuestos: [{ impuesto: { valor: '12' } }], // Usado para valor_iva
          },
        },
      ],
    },
  };

  beforeEach(() => {
    // Mockear todas las dependencias externas que usa el servicio procesarFacturaCompleta y crearFacturaCompleta
    identificationType.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'typeId1',
        codigo: '05',
        nombre: 'CEDULA',
      }),
    );

    // Usar un certificado mock en lugar de leer el archivo real
    const certB64 = 'Q0VSVElGSUNBRE9fTU9DS19QQVJBX1BSVUVCQVMz'; // Certificado falso en base64
    const { encrypt } = require('../src/utils/encryption.utils');

    issuingCompany.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'companyId1',
        ruc: '1799999999001',
        razon_social: 'Test Company',
        nombre_comercial: 'Test Company',
        direccion: 'Test Address',
        direccion_matriz: 'Test Matrix Address',
        direccion_establecimiento: 'Test Establishment Address',
        codigo_establecimiento: '001',
        punto_emision: '001',
        tipo_ambiente: 1, // Pruebas
        tipo_emision: 1, // Normal
        obligado_contabilidad: false,
        certificate: certB64,
        certificate_password: encrypt('Pablo2020'),
      }),
    );

    client.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'clientId1',
        identificacion: '0923456789',
        razon_social: 'Test Client',
        email: 'client@test.com',
        telefono: '0999999999',
      }),
    );

    product.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'prodId1',
        codigo: 'P001',
        nombre: 'Producto 1',
        descripcion: 'Producto de prueba',
        precio_venta: 100,
        precio_unitario: 100,
        tiene_iva: true,
      }),
    );

    // Mock para generarSecuencial (Invoice.findOne(...).sort(...))
    const mockSort = jest.fn().mockResolvedValue(null); // Por defecto, no hay ultimaFactura
    invoice.findOne.mockReturnValue({ sort: mockSort } as any); // Invoice.findOne devuelve un objeto con un método sort mockeado

    // Mock para Invoice.save y InvoiceDetail.save
    invoice.save.mockImplementation(mockSaveWithToObject());

    invoiceDetail.save.mockImplementation(mockSaveWithToObject());

    // Mock procesarEnvioSRI para que no ejecute el proceso real
    jest
      .spyOn(require('../src/services/invoice.service').InvoiceService, 'procesarEnvioSRI')
      .mockImplementation(() => Promise.resolve());

    // No need to mock existsSync; the service will create a temp file
  });

  it('creates invoice with details asynchronously', async () => {
    // Re-afirmar los mocks críticos para asegurar el flujo exitoso de este test
    identificationType.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'typeId1',
        codigo: '05',
        nombre: 'CEDULA',
      }),
    );

    // Usar un certificado mock en lugar de leer el archivo real
    const certB64 = 'Q0VSVElGSUNBRE9fTU9DS19QQVJBX1BSVUVCQVMz'; // Certificado falso en base64
    const { encrypt } = require('../src/utils/encryption.utils');

    issuingCompany.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'companyId1',
        ruc: '1799999999001',
        codigo_establecimiento: '001',
        punto_emision: '001',
        tipo_ambiente: 1,
        tipo_emision: 1,
        certificate: certB64,
        certificate_password: encrypt('Pablo2020'),
      }),
    );

    client.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'clientId1',
        identificacion: '0923456789',
      }),
    );

    product.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'prodId1',
        codigo: 'P001',
        nombre: 'Producto 1',
        precio_venta: 100,
      }),
    );

    // Asegurar que la búsqueda de la última factura para secuencial funcione como se espera
    const mockSort = jest.fn().mockResolvedValue(null);
    invoice.findOne.mockReturnValue({ sort: mockSort } as any);

    // Asegurar que los guardados funcionen
    invoice.save.mockImplementation(mockSaveWithToObject());
    invoiceDetail.save.mockImplementation(mockSaveWithToObject());

    const res = await request(app).post('/api/v1/invoice/complete').set('Authorization', authHeader).send(payload);

    if (res.status !== 201) {
      console.log('Test Response Body on Error:', res.body);
    } else {
      console.log('Response structure:', JSON.stringify(res.body, null, 2));
    }

    expect(res.status).toBe(201);
    expect(invoice.save).toHaveBeenCalled();
    expect(invoiceDetail.save).toHaveBeenCalled();

    // Actualizar expectativas para estructura correcta
    // Comprobar que la factura existe
    expect(res.body.data.factura).toBeDefined();

    // Comprobar secuencial y clave de acceso en la estructura correcta
    expect(res.body.data.factura.data.clave_acceso).toMatch(/^\d{49}$/);
    expect(res.body.data.factura.data.secuencial).toBe('000000001');

    // Verificar que el estado inicial sea PENDIENTE
    expect(res.body.data.factura.sri_estado).toBe('PENDIENTE');

    // Verificar que el procesamiento asíncrono fue llamado
    const invoiceServiceModule = require('../src/services/invoice.service');
    expect(invoiceServiceModule.InvoiceService.procesarEnvioSRI).toHaveBeenCalled();

    // En el resultado de la API no debería haber respuesta SRI porque es asíncrona
    expect(res.body.data.respuesta_sri).toBeFalsy();
  });

  it('fails when product not found', async () => {
    // Configurar todos los mocks necesarios excepto el producto
    identificationType.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'typeId1',
        codigo: '05',
        nombre: 'CEDULA',
      }),
    );

    const certB64 = 'Q0VSVElGSUNBRE9fTU9DS19QQVJBX1BSVUVCQVMz';
    const { encrypt } = require('../src/utils/encryption.utils');

    issuingCompany.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'companyId1',
        ruc: '1799999999001',
        codigo_establecimiento: '001',
        punto_emision: '001',
        tipo_ambiente: 1,
        tipo_emision: 1,
        certificate: certB64,
        certificate_password: encrypt('Pablo2020'),
      }),
    );

    client.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'clientId1',
        identificacion: '0923456789',
      }),
    );

    // Mock de secuencial
    const mockSort = jest.fn().mockResolvedValue(null);
    invoice.findOne.mockReturnValue({ sort: mockSort } as any);

    // El producto no existe (esto causa el error)
    product.findOne.mockResolvedValueOnce(null);

    const res = await request(app).post('/api/v1/invoice/complete').set('Authorization', authHeader).send(payload);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Product not found: P001');
  });

  // Test específico para verificar la actualización asíncrona del SRI
  it('correctly sets up procesarEnvioSRI for asynchronous processing', async () => {
    // Configurar todos los mocks necesarios
    identificationType.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'typeId1',
        codigo: '05',
        nombre: 'CEDULA',
      }),
    );

    const certB64 = 'Q0VSVElGSUNBRE9fTU9DS19QQVJBX1BSVUVCQVMz';
    const { encrypt } = require('../src/utils/encryption.utils');

    issuingCompany.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'companyId1',
        ruc: '1799999999001',
        codigo_establecimiento: '001',
        punto_emision: '001',
        tipo_ambiente: 1,
        tipo_emision: 1,
        certificate: certB64,
        certificate_password: encrypt('Pablo2020'),
      }),
    );

    client.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'clientId1',
        identificacion: '0923456789',
      }),
    );

    product.findOne.mockResolvedValue(
      createMockWithToObject({
        _id: 'prodId1',
        codigo: 'P001',
        nombre: 'Producto 1',
        precio_venta: 100,
      }),
    );

    const mockSort = jest.fn().mockResolvedValue(null);
    invoice.findOne.mockReturnValue({ sort: mockSort } as any);

    invoice.save.mockImplementation(mockSaveWithToObject());
    invoiceDetail.save.mockImplementation(mockSaveWithToObject());

    // Create a spy on procesarEnvioSRI to observe how it's called
    const procesarEnvioSRISpy = jest
      .spyOn(require('../src/services/invoice.service').InvoiceService, 'procesarEnvioSRI')
      .mockImplementation(() => Promise.resolve());

    // Call the invoice creation endpoint
    const res = await request(app).post('/api/v1/invoice/complete').set('Authorization', authHeader).send(payload);

    // Verify that the endpoint returns 201 without waiting for SRI
    expect(res.status).toBe(201);

    // Verify that procesarEnvioSRI was called
    expect(procesarEnvioSRISpy).toHaveBeenCalled();

    // The function should be called with 5 arguments: factura, empresa, cliente, productos, datosFactura
    const firstCallArgs = procesarEnvioSRISpy.mock.calls[0];
    expect(firstCallArgs.length).toBe(5);
    // El primer argumento debería ser la factura creada
    expect(firstCallArgs[0]).toBeDefined();
    // El segundo argumento debería ser la empresa emisora
    expect(firstCallArgs[1]).toBeDefined();
    // El tercer argumento debería ser el cliente
    expect(firstCallArgs[2]).toBeDefined();
    // El cuarto argumento debería ser los productos
    expect(firstCallArgs[3]).toBeDefined();
    // El quinto argumento debería ser los datos originales de la factura
    expect(firstCallArgs[4]).toBeDefined();
  });

  // Aquí podrías añadir más tests para otros casos de error:
  // - Empresa no encontrada
  // - Tipo de identificación no encontrado
  // - Cliente no encontrado
  // - Error en la firma (fs.existsSync devuelve false)
});

// ... resto del código de tests ...
// (El código de 'describe('Auth endpoints')' y 'describe('CRUD endpoints')'
//  necesitará que los mocks UserControl.findOne, etc. sean usados correctamente,
//  o adaptar los nombres de las variables mock si es necesario)
// (Asegúrate de que 'identificationType.save' etc. se usen en los tests CRUD)
// (El spyOn de bcryptjs y jsonwebtoken debe estar dentro de los tests o beforeEach donde se necesiten)
