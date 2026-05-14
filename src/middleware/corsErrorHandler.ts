import { Request, Response, NextFunction } from 'express';

export const corsErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Verificar si es un error de CORS
  if (err.message.includes('CORS policy')) {
    console.log(`🚫 CORS Error: ${err.message}`);
    console.log(`📍 Request from: ${req.get('Origin') || 'No origin'}`);
    console.log(`🔍 Method: ${req.method} - Path: ${req.path}`);

    res.status(403).json({
      error: 'CORS Error',
      message: 'Este origen no está permitido por la política de CORS',
      details: {
        origin: req.get('Origin'),
        method: req.method,
        path: req.path,
      },
      solution: 'Contacta al administrador para agregar tu dominio a la lista de orígenes permitidos',
    });
    return;
  }

  // Si no es un error de CORS, pasar al siguiente middleware de error
  next(err);
};

export default corsErrorHandler;
