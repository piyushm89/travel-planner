import { z } from 'zod';
import Trip from '../models/Trip.js';
import { generateItineraryJSON } from '../utils/openai.js';
import { searchPlaces } from '../utils/places.js';
import { getImageForQuery } from '../utils/unsplash.js';
import crypto from 'crypto';

const createSchema = z.object({
  destination: z.string().min(2),
  budget: z.enum(['low', 'medium', 'high']).default('medium'),
  startDate: z.string(),
  endDate: z.string(),
  interests: z.array(z.string()).default([]),
  currency: z.string().default('INR')
});

export async function createTrip(req, res) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const { destination, budget, startDate, endDate, interests, currency } = parsed.data;

  const plan = await generateItineraryJSON({ destination, budget, startDate, endDate, interests, currency });

  for (const day of plan.itinerary) {
    for (const act of day.activities) {
      const query = `${act.title} ${destination}`;
      const places = await searchPlaces({ query });
      if (places.length) {
        const p = places[0];
        act.placeId = p.id;
        act.address = p.formattedAddress || '';
        act.lat = p.location?.latitude;
        act.lng = p.location?.longitude;
        act.rating = p.rating;
        act.priceLevel = p.priceLevel;
      }
      const imageQuery = act.title || destination;
      act.imageUrl = await getImageForQuery(imageQuery);
    }
  }

  const shareId = crypto.randomBytes(8).toString('hex');

  const trip = await Trip.create({
    userId: req.user.id,
    destination, budget, startDate, endDate, interests, currency,
    itinerary: plan.itinerary,
    shareId
  });

  res.json(trip);
}

export async function listTrips(req, res) {
  const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(trips);
}

export async function getTrip(req, res) {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  if (!trip) return res.status(404).json({ error: 'Not found' });
  res.json(trip);
}

export async function updateTrip(req, res) {
  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: req.body },
    { new: true }
  );
  if (!trip) return res.status(404).json({ error: 'Not found' });
  res.json(trip);
}

export async function deleteTrip(req, res) {
  await Trip.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ ok: true });
}

export async function getSharedTrip(req, res) {
  const trip = await Trip.findOne({ shareId: req.params.shareId });
  if (!trip) return res.status(404).json({ error: 'Not found' });
  res.json(trip);
}
