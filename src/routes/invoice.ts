import { Router } from 'express';
import Invoice from '../models/Invoice';
import { InvoiceService } from '../services/invoice.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const doc = new Invoice(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/complete', async (req, res) => {
  try {
    if (!req.body.factura) {
      return res.status(400).json({
        success: false,
        message: 'Invoice data is required',
      });
    }

    const resultado = await InvoiceService.crearFacturaCompleta(req.body.factura);

    return res.status(201).json({
      success: true,
      data: resultado,
      xml: resultado.xml,
    });
  } catch (err: any) {
    // Errors that should return 400 (Bad Request)
    const validationErrors = [
      'Product not found',
      'Client not found',
      'Identification type not found',
      'Empresa emisora no encontrada',
      'Invalid date format',
      'Datos de factura inválidos o incompletos',
    ];

    const isValidationError = validationErrors.some((error) => err.message.includes(error));

    if (isValidationError) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // All other errors are server errors (500)
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get('/', async (_req, res) => {
  try {
    const docs = await Invoice.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await Invoice.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const doc = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const doc = await Invoice.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
