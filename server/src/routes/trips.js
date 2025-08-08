import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createTrip, listTrips, getTrip, updateTrip, deleteTrip, getSharedTrip } from '../controllers/trips.js';
import { generatePdf } from '../utils/pdf.js';

const r = Router();

r.get('/', requireAuth, listTrips);
r.post('/', requireAuth, createTrip);
r.get('/:id', requireAuth, getTrip);
r.put('/:id', requireAuth, updateTrip);
r.delete('/:id', requireAuth, deleteTrip);

r.get('/share/:shareId', getSharedTrip);

r.get('/:id/pdf', requireAuth, async (req, res) => {
  try {
    const pdfStream = await generatePdf(req.params.id, req.user.id);
    res.setHeader('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
  } catch (e) {
    res.status(404).json({ error: 'PDF failed' });
  }
});

export default r;
