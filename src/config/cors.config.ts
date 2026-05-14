import { CorsOptions } from 'cors';

// Obtener orígenes permitidos desde variables de entorno
const getAllowedOrigins = (): string[] => {
  const defaultOrigins = [
    // Desarrollo local
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4200',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:8080',
  ];

  // Agregar orígenes desde variable de entorno si existe
  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (envOrigins) {
    const additionalOrigins = envOrigins.split(',').map((origin) => origin.trim());
    return [...defaultOrigins, ...additionalOrigins];
  }

  return defaultOrigins;
};

const allowedOrigins = getAllowedOrigins();

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (ej: aplicaciones móviles, Postman, curl)
    if (!origin) {
      console.log('✅ Request without origin allowed (mobile app, Postman, etc.)');
      return callback(null, true);
    }

    // En desarrollo, permitir cualquier localhost
    if (process.env.NODE_ENV === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        console.log(`✅ Development origin allowed: ${origin}`);
        return callback(null, true);
      }
    }

    // Verificar si el origen está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Origin allowed: ${origin}`);
      return callback(null, true);
    }

    // Permitir todos los dominios de Vercel de el300profe-7588s-projects (mejorada la lógica)
    if (origin.endsWith('.vercel.app') && origin.includes('el300profe-7588s-projects')) {
      console.log(`✅ Vercel domain allowed: ${origin}`);
      return callback(null, true);
    }

    // Logging para debug
    console.log(`🚫 CORS blocked origin: ${origin}`);
    console.log(`📋 Allowed origins:`, allowedOrigins);

    // Rechazar el origen
    const msg = `CORS policy: Origin ${origin} is not allowed`;
    return callback(new Error(msg), false);
  },

  // Permitir cookies y headers de autenticación
  credentials: true,

  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],

  // Headers permitidos en las peticiones
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'x-access-token',
    'x-auth-token',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
  ],

  // Headers que el cliente puede acceder
  exposedHeaders: ['set-cookie', 'Authorization', 'x-access-token', 'x-auth-token'],

  // Tiempo de cache para preflight requests (24 horas)
  maxAge: 86400,

  // Permitir headers no estándar
  optionsSuccessStatus: 200,
};

// Configuración permisiva para desarrollo
export const corsDevOptions: CorsOptions = {
  origin: true, // Permitir cualquier origen en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: '*',
  exposedHeaders: '*',
  optionsSuccessStatus: 200,
};

// Función para obtener la configuración correcta según el entorno
export const getCorsConfig = (): CorsOptions => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Si hay una variable CORS_DISABLED, deshabilitar CORS completamente
  if (process.env.CORS_DISABLED === 'true') {
    console.log('⚠️  CORS DISABLED - All origins allowed');
    return corsDevOptions;
  }

  const config = isDevelopment ? corsDevOptions : corsOptions;

  console.log(`🌐 CORS configured for: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
  if (!isDevelopment) {
    console.log(`📋 Allowed origins:`, allowedOrigins);
  }

  return config;
};
