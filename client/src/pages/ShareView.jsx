import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function ShareView() {
  const { shareId } = useParams();
  const [trip, setTrip] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/trips/share/${shareId}`);
        setTrip(data);
      } catch {
        setErr('Trip not found or no longer available');
      }
    }
    load();
  }, [shareId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysDuration = () => {
    if (!trip) return 0;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  if (err) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4'>
        <div className='text-center'>
          <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-12 max-w-md mx-auto'>
            <div className='h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg className='h-8 w-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-3'>Trip Not Found</h3>
            <p className='text-gray-600 mb-6'>{err}</p>
            <Link
              to='/dashboard'
              className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2'
            >
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' />
              </svg>
              <span>Explore AI Travel Planner</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading shared trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' />
                </svg>
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                AI Travel Planner
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-600 text-sm'>Shared Itinerary</span>
              <Link
                to='/register'
                className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm'
              >
                Create Your Own
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
        {/* Hero Section */}
        <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden'>
          <div className='h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative'>
            <div className='absolute inset-0 bg-black/30'></div>
            <div className='absolute bottom-6 left-6 text-white'>
              <h1 className='text-4xl font-bold mb-2'>{trip.destination}</h1>
              <div className='flex items-center space-x-4 text-lg'>
                <div className='flex items-center space-x-2'>
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  <span>{formatDate(trip.startDate)} → {formatDate(trip.endDate)}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span>{getDaysDuration()} days</span>
                </div>
              </div>
            </div>
            <div className='absolute top-4 right-4'>
              <div className='bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium'>
                Shared Travel Itinerary
              </div>
            </div>
          </div>
          
          <div className='p-6 bg-white/50'>
            <div className='flex items-center space-x-4'>
              {trip.budget && (
                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
                  {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)} Budget
                </span>
              )}
              {trip.travelers && (
                <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
                  {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}
                </span>
              )}
              <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium'>
                AI Generated
              </span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center'>
          <div className='max-w-2xl mx-auto'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Love this itinerary?</h2>
            <p className='text-gray-600 mb-6'>
              Create your own personalized travel plans with our AI-powered travel planner. Get custom recommendations based on your preferences, budget, and interests.
            </p>
            <div className='flex justify-center space-x-4'>
              <Link
                to='/register'
                className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2'
              >
                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
                <span>Start Planning</span>
              </Link>
              <Link
                to='/login'
                className='bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105'
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Itinerary Days */}
        <div className='space-y-6'>
          {trip.itinerary.map((day, dayIndex) => (
            <div
              key={day.date}
              className='bg-white/70 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden'
              style={{ animationDelay: `${dayIndex * 100}ms` }}
            >
              <div className='bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-white/20'>
                <h3 className='text-2xl font-bold text-gray-800 flex items-center space-x-3'>
                  <span className='bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold'>
                    {dayIndex + 1}
                  </span>
                  <span>{formatDate(day.date)}</span>
                </h3>
              </div>

              <div className='p-6 space-y-4'>
                {day.activities.map((activity, activityIndex) => (
                  <div
                    key={activityIndex}
                    className='flex gap-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors duration-200'
                  >
                    {activity.imageUrl && (
                      <div className='flex-shrink-0'>
                        <img
                          src={activity.imageUrl}
                          alt={activity.title}
                          className='w-24 h-24 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md'
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <div className='flex items-center space-x-2 mb-1'>
                            <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium'>
                              {activity.time}
                            </span>
                            {activity.rating && (
                              <div className='flex items-center space-x-1'>
                                <svg className='h-4 w-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                </svg>
                                <span className='text-sm font-medium text-gray-700'>{activity.rating}</span>
                              </div>
                            )}
                          </div>
                          <h4 className='text-lg font-bold text-gray-800 mb-1'>{activity.title}</h4>
                          {activity.address && (
                            <p className='text-gray-600 text-sm flex items-center space-x-1'>
                              <svg className='h-4 w-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                              </svg>
                              <span>{activity.address}</span>
                            </p>
                          )}
                          {activity.description && (
                            <p className='text-gray-600 text-sm mt-2'>{activity.description}</p>
                          )}
                        </div>
                        
                        {activity.lat && activity.lng && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`}
                            target='_blank'
                            rel='noreferrer'
                            className='bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-1'
                          >
                            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' />
                            </svg>
                            <span>View on Map</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center'>
          <h3 className='text-2xl font-bold text-gray-800 mb-4'>Ready to plan your next adventure?</h3>
          <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
            Join thousands of travelers who use our AI-powered platform to create amazing, personalized itineraries for their dream destinations.
          </p>
          <Link
            to='/register'
            className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2 text-lg'
          >
            <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
            </svg>
            <span>Get Started for Free</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
