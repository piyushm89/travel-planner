import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function NewTrip() {
  const [form, setForm] = useState({
    destination: '', budget: 'medium', startDate: '', endDate: '', interests: '', currency: 'INR', travelers: 1
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const payload = {
        destination: form.destination,
        budget: form.budget,
        startDate: form.startDate,
        endDate: form.endDate,
        interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
        currency: form.currency,
        travelers: parseInt(form.travelers)
      };
      const { data } = await api.post('/trips', payload);
      navigate(`/trip/${data._id}`);
    } catch (e) {
      setErr(e.response?.data?.error || 'Error creating trip');
    } finally {
      setLoading(false);
    }
  }

  const budgetOptions = [
    { value: 'low', label: 'Budget-Friendly', desc: 'Under ₹8,000/day', icon: '💰' },
    { value: 'medium', label: 'Comfortable', desc: '₹8,000-25,000/day', icon: '🏨' },
    { value: 'high', label: 'Luxury', desc: '₹25,000+/day', icon: '✨' }
  ];

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Header */}
      <div className='text-center mb-8'>
        <div className='flex items-center justify-center space-x-3 mb-4'>
          <Link to='/dashboard' className='text-gray-500 hover:text-blue-600 transition-colors duration-200'>
            <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
          </Link>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Plan Your Adventure
          </h1>
        </div>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
          Let our AI create a personalized travel itinerary just for you. Tell us about your dream destination and preferences.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className='bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-8'>
        {err && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3'>
            <svg className='h-5 w-5 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <span className='text-red-700'>{err}</span>
          </div>
        )}

        {/* Destination */}
        <div className='space-y-3'>
          <label className='block text-sm font-semibold text-gray-700 flex items-center space-x-2'>
            <svg className='h-4 w-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
            </svg>
            <span>Where do you want to go?</span>
          </label>
          <input
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
            placeholder='e.g., Paris, Tokyo, New York City'
            value={form.destination}
            onChange={e => setForm({ ...form, destination: e.target.value })}
            required
          />
        </div>

        {/* Dates */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <label className='block text-sm font-semibold text-gray-700 flex items-center space-x-2'>
              <svg className='h-4 w-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <span>Start Date</span>
            </label>
            <input
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
              type='date'
              value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })}
              required
            />
          </div>
          <div className='space-y-3'>
            <label className='block text-sm font-semibold text-gray-700 flex items-center space-x-2'>
              <svg className='h-4 w-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <span>End Date</span>
            </label>
            <input
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
              type='date'
              value={form.endDate}
              onChange={e => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Budget Selection */}
        <div className='space-y-4'>
          <label className='block text-sm font-semibold text-gray-700 flex items-center space-x-2'>
            <svg className='h-4 w-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
            </svg>
            <span>Budget Range</span>
          </label>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {budgetOptions.map(option => (
              <label
                key={option.value}
                className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                  form.budget === option.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type='radio'
                  name='budget'
                  value={option.value}
                  checked={form.budget === option.value}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                  className='sr-only'
                />
                <div className='flex items-center space-x-3'>
                  <span className='text-2xl'>{option.icon}</span>
                  <div>
                    <div className='font-semibold text-gray-800'>{option.label}</div>
                    <div className='text-sm text-gray-600'>{option.desc}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <label className='block text-sm font-semibold text-gray-700 flex items-center space-x-2'>
              <svg className='h-4 w-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' />
              </svg>
              <span>Number of Travelers</span>
            </label>
            <select
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
              value={form.travelers}
              onChange={e => setForm({ ...form, travelers: e.target.value })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Person' : 'People'}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-3'>
            <label className='block text-sm font-semibold text-gray-700 flex items-center space-x-2'>
              <svg className='h-4 w-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
              </svg>
              <span>Currency</span>
            </label>
            <select
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
              value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}
            >
              <option value='INR'>INR - Indian Rupee</option>
              <option value='USD'>USD - US Dollar</option>
              <option value='EUR'>EUR - Euro</option>
              <option value='GBP'>GBP - British Pound</option>
              <option value='AED'>AED - UAE Dirham</option>
              <option value='SGD'>SGD - Singapore Dollar</option>
              <option value='CAD'>CAD - Canadian Dollar</option>
              <option value='AUD'>AUD - Australian Dollar</option>
              <option value='JPY'>JPY - Japanese Yen</option>
            </select>
          </div>
        </div>

        {/* Interests */}
        <div className='space-y-3'>
          <label className='block text-sm font-semibold text-gray-700 flex items-center space-x-2'>
            <svg className='h-4 w-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
            </svg>
            <span>Your Interests</span>
          </label>
          <input
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
            placeholder='e.g., museums, food tours, nightlife, hiking, shopping'
            value={form.interests}
            onChange={e => setForm({ ...form, interests: e.target.value })}
          />
          <p className='text-sm text-gray-500'>Separate multiple interests with commas</p>
        </div>

        {/* Submit Button */}
        <div className='flex justify-center pt-6'>
          <button
            type='submit'
            disabled={loading || !form.destination || !form.startDate || !form.endDate}
            className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
              loading || !form.destination || !form.startDate || !form.endDate
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg'
            }`}
          >
            {loading ? (
              <div className='flex items-center space-x-2'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                <span>Creating Your Itinerary...</span>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
                <span>Generate My Trip</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
