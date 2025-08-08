import { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    try {
      const { data } = await api.get('/trips');
      setTrips(data);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='text-center'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
          Your Travel Adventures
        </h1>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
          Discover and manage your AI-generated travel itineraries. Create new adventures or revisit your favorite journeys.
        </p>
      </div>

      {/* Action Bar */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <h2 className='text-2xl font-semibold text-gray-800'>My Trips</h2>
          <span className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full'>
            {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
          </span>
        </div>
        <Link
          to='/new'
          className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg'
        >
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          <span>Create New Trip</span>
        </Link>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className='text-center py-16'>
          <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-12 max-w-md mx-auto'>
            <div className='h-16 w-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg className='h-8 w-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-3'>No trips yet</h3>
            <p className='text-gray-600 mb-6'>
              Start planning your next adventure with our AI-powered travel planner!
            </p>
            <Link
              to='/new'
              className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2'
            >
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              <span>Plan Your First Trip</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {trips.map((trip, index) => (
            <div
              key={trip._id}
              className='group bg-white/70 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Trip Image/Header */}
              <div className='h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden'>
                <div className='absolute inset-0 bg-black/20'></div>
                <div className='absolute bottom-4 left-4 text-white'>
                  <h3 className='text-xl font-bold'>{trip.destination}</h3>
                  <p className='text-sm opacity-90'>
                    {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                  </p>
                </div>
                <div className='absolute top-4 right-4'>
                  <span className='bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium'>
                    {trip.budget || 'Budget not set'}
                  </span>
                </div>
              </div>

              {/* Trip Content */}
              <div className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-2'>
                    <svg className='h-4 w-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                    <span className='text-sm text-gray-600'>Destination</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <svg className='h-4 w-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                    <span className='text-sm text-gray-600'>
                      {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>

                {trip.travelers && (
                  <div className='flex items-center space-x-2 mb-4'>
                    <svg className='h-4 w-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' />
                    </svg>
                    <span className='text-sm text-gray-600'>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
                  </div>
                )}

                <div className='flex space-x-3 mt-6'>
                  <Link
                    to={`/trip/${trip._id}`}
                    className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center transform hover:scale-105'
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/trip/${trip._id}/share`}
                    className='bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center'
                  >
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z' />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
