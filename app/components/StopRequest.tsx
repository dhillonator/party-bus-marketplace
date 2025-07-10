'use client';
import { useState } from 'react';
import { X, MapPin, Clock, DollarSign, AlertCircle } from 'lucide-react';

interface StopRequestProps {
  bookingId: string;
  currentLocation: string;
  hourlyRate: number;
  onClose: () => void;
}

export default function StopRequest({ bookingId, currentLocation, hourlyRate, onClose }: StopRequestProps) {
  const [stopAddress, setStopAddress] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(15); // Default 15 min
  const [calculating, setCalculating] = useState(false);
  const [additionalCost, setAdditionalCost] = useState<number | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'pending' | 'approved' | 'denied'>('idle');

  const calculateCost = async () => {
    setCalculating(true);
    
    // Mock calculation - in production, call Google Maps API
    setTimeout(() => {
      const detourTime = 10; // Mock 10 min detour
      const totalMinutes = detourTime + estimatedDuration;
      
      // Calculate cost
      let cost = (totalMinutes / 60) * hourlyRate;
      
      // Add premium for long stops
      if (totalMinutes > 30) {
        cost *= 1.2;
      }
      
      // Minimum $25
      setAdditionalCost(Math.max(25, Math.round(cost)));
      setCalculating(false);
    }, 1000);
  };

  const submitRequest = async () => {
    if (!stopAddress || !additionalCost) return;
    
    setRequesting(true);
    setRequestStatus('pending');
    
    // Mock API call
    setTimeout(() => {
      // Simulate driver response (approved 70% of time)
      const approved = Math.random() > 0.3;
      setRequestStatus(approved ? 'approved' : 'denied');
      setRequesting(false);
      
      if (approved) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }, 5000); // 5 second mock delay for driver response
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">Add a stop</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {requestStatus === 'idle' && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Stop address</label>
                <input
                  type="text"
                  placeholder="Enter stop address"
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={stopAddress}
                  onChange={(e) => setStopAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">How long do you need at this stop?</label>
                <select
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
                >
                  <option value={5}>5 minutes (quick pickup)</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              {!additionalCost && (
                <button
                  onClick={calculateCost}
                  disabled={!stopAddress || calculating}
                  className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {calculating ? 'Calculating cost...' : 'Calculate additional cost'}
                </button>
              )}

              {additionalCost && (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Additional cost:</span>
                      <span className="text-2xl font-medium">${additionalCost}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      This will be charged to your payment method if the driver approves
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Driver approval required</p>
                        <p className="text-yellow-700">The driver needs to approve this stop based on their schedule</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={submitRequest}
                    disabled={requesting}
                    className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
                  >
                    Request stop (${additionalCost})
                  </button>
                </>
              )}
            </>
          )}

          {requestStatus === 'pending' && (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-lg font-medium mb-2">Waiting for driver approval...</p>
              <p className="text-sm text-gray-600">This usually takes less than 2 minutes</p>
            </div>
          )}

          {requestStatus === 'approved' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">Stop approved!</p>
              <p className="text-sm text-gray-600">
                Your driver will stop at {stopAddress}. ${additionalCost} will be added to your trip.
              </p>
            </div>
          )}

          {requestStatus === 'denied' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-lg font-medium mb-2">Stop not possible</p>
              <p className="text-sm text-gray-600 mb-4">
                The driver cannot accommodate this stop due to scheduling constraints.
              </p>
              <button
                onClick={() => setRequestStatus('idle')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Try a different location or duration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}