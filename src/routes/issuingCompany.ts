import { Router } from 'express';
import IssuingCompany from '../models/IssuingCompany';
import fs from 'fs';
import { encrypt } from '../utils/encryption.utils';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const docs = await IssuingCompany.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await IssuingCompany.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { certificatePath, certificate, certificatePassword, certificate_password, ...rest } = req.body;

    let certBase64 = certificate;
    if (certificatePath) {
      certBase64 = fs.readFileSync(certificatePath).toString('base64');
    }

    // Use certificate_password or certificatePassword, whichever is available
    const passwordToEncrypt = certificate_password || certificatePassword;
    const encryptedPass = passwordToEncrypt ? encrypt(passwordToEncrypt) : undefined;

    const updateData: any = { ...rest };
    if (certBase64) updateData.certificate = certBase64;
    if (encryptedPass) updateData.certificate_password = encryptedPass;

    const doc = await IssuingCompany.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const doc = await IssuingCompany.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
