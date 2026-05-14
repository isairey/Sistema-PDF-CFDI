import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint público para probar CORS (sin autenticación)
router.get('/cors-test', (req: Request, res: Response) => {
  const origin = req.get('Origin');
  const userAgent = req.get('User-Agent');
  const method = req.method;

  console.log(`🧪 CORS Test Request:`);
  console.log(`   Origin: ${origin || 'No origin'}`);
  console.log(`   Method: ${method}`);
  console.log(`   User-Agent: ${userAgent}`);

  res.json({
    message: '✅ CORS is working correctly!',
    timestamp: new Date().toISOString(),
    requestInfo: {
      origin: origin || 'No origin',
      method,
      path: req.path,
      userAgent,
      headers: req.headers,
    },
    corsInfo: {
      status: 'success',
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentialsAllowed: true,
    },
  });
});

// Endpoint POST para probar CORS con datos
router.post('/cors-test', (req: Request, res: Response) => {
  const origin = req.get('Origin');

  console.log(`🧪 CORS POST Test Request from: ${origin || 'No origin'}`);
  console.log(`📋 Body:`, req.body);

  res.json({
    message: '✅ CORS POST request successful!',
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    origin: origin || 'No origin',
  });
});

export default router;
