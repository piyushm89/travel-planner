import PDFDocument from 'pdfkit';
import Trip from '../models/Trip.js';
import axios from 'axios';

export async function generatePdf(tripId, userId) {
  const trip = await Trip.findOne({ _id: tripId, userId });
  if (!trip) throw new Error('Trip not found');

  const doc = new PDFDocument({ margin: 40 });

  doc.fontSize(20).text(`Trip: ${trip.destination}`, { underline: true });
  doc.moveDown().fontSize(12)
    .text(`Dates: ${trip.startDate} to ${trip.endDate}`)
    .text(`Budget: ${trip.budget}`)
    .text(`Interests: ${trip.interests.join(', ')}`);

  doc.moveDown();

  for (const day of trip.itinerary) {
    doc.fontSize(16).text(`Date: ${day.date}`);
    for (const act of day.activities) {
      doc.fontSize(13).text(`- ${act.time} ${act.title} (${act.rating ?? 'N/A'}★)`);
      if (act.address) doc.fontSize(11).text(`  ${act.address}`);
      if (act.imageUrl) {
        try {
          const imgRes = await axios.get(act.imageUrl, { responseType: 'arraybuffer' });
          const buf = Buffer.from(imgRes.data);
          doc.image(buf, { width: 250 });
        } catch {}
      }
      doc.moveDown(0.5);
    }
    doc.moveDown();
  }

  doc.end();
  return doc;
}
