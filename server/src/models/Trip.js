import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
  date: String,
  activities: [{
    time: String,
    title: String,
    description: String,
    placeId: String,
    address: String,
    lat: Number,
    lng: Number,
    imageUrl: String,
    rating: Number,
    priceLevel: Number
  }]
}, { _id: false });

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  destination: String,
  budget: String,
  startDate: String,
  endDate: String,
  interests: [String],
  currency: String,
  itinerary: [daySchema],
  shareId: { type: String, index: true },
  weather: Object
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);
