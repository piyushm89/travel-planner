import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  async function load() {
    try {
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data);
    } catch (e) {
      setErr('Failed to load trip');
      if (e.response?.status === 401) {
        navigate('/login');
      }
    }
  }

  async function remove() {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) return;
    try {
      await api.delete(`/trips/${id}`);
      navigate('/dashboard');
    } catch (e) {
      alert('Failed to delete trip');
    }
  }

  function pdf() {
    window.open(`${import.meta.env.VITE_API_BASE}/trips/${id}/pdf`, '_blank');
  }

  async function copyShareLink() {
    const shareUrl = `${window.location.origin}/share/${trip.shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

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

  useEffect(() => { load(); }, [id]);

  if (err) {
    return (
      <div className='text-center py-16'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto'>
          <svg className='h-12 w-12 text-red-500 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <h3 className='text-lg font-semibold text-red-800 mb-2'>Error Loading Trip</h3>
          <p className='text-red-600 mb-4'>{err}</p>
          <Link
            to='/dashboard'
            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200'
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading your trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden'>
        <div className='h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative'>
          <div className='absolute inset-0 bg-black/30'></div>
          <div className='absolute top-4 left-4'>
            <Link
              to='/dashboard'
              className='bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center space-x-2'
            >
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
              </svg>
              <span>Back</span>
            </Link>
          </div>
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
        </div>
        
        {/* Action Bar */}
        <div className='p-6 flex flex-wrap gap-3 justify-between items-center bg-white/50'>
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
          </div>
          <div className='flex gap-3'>
            <button
              onClick={pdf}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2'
            >
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <span>Export PDF</span>
            </button>
            <Link
              to={`/trip/${trip._id}/share`}
              className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2'
            >
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z' />
              </svg>
              <span>Share</span>
            </Link>
            <button
              onClick={remove}
              className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2'
            >
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
              </svg>
              <span>Delete</span>
            </button>
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
              <h2 className='text-2xl font-bold text-gray-800 flex items-center space-x-3'>
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold'>
                  {dayIndex + 1}
                </span>
                <span>{formatDate(day.date)}</span>
              </h2>
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
                        <h3 className='text-lg font-bold text-gray-800 mb-1'>{activity.title}</h3>
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

      {/* Share Section */}
      <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6'>
        <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2'>
          <svg className='h-5 w-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z' />
          </svg>
          <span>Share Your Trip</span>
        </h3>
        <p className='text-gray-600 mb-4'>Share this itinerary with friends and family using the link below:</p>
        <div className='flex gap-3'>
          <input
            className='flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm'
            value={`${window.location.origin}/share/${trip.shareId}`}
            readOnly
          />
          <button
            onClick={copyShareLink}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              copied
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? (
              <>
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                </svg>
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
