'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface Bus {
  id: string;
  name: string;
  capacity: number;
  hourlyRate: number;
  features: string[];
  operator: {
    id: string;
    companyName: string;
    city: string;
  };
}

interface TripDetails {
  pickup: string;
  destination: string;
  date: string;
  departTime: string;
  returnDate?: string;
  returnTime?: string;
  returnPickup?: string;
  returnDestination?: string;
  passengers: string; // Changed to string for empty default
  differentReturnLocation: boolean;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripType = searchParams.get('type') || 'roundtrip';
  const presetDestination = searchParams.get('destination') || '';
  
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState<number | null>(null);
  const [waitTime, setWaitTime] = useState<number | null>(null);
  
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    pickup: '',
    destination: presetDestination,
    date: '',
    departTime: '',
    returnDate: '',
    returnTime: '',
    returnPickup: '',
    returnDestination: '',
    passengers: '', // Empty by default
    differentReturnLocation: false,
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  // Auto-fill return date with outbound date
  useEffect(() => {
    if (tripDetails.date && !tripDetails.returnDate) {
      setTripDetails(prev => ({ ...prev, returnDate: tripDetails.date }));
    }
  }, [tripDetails.date]);

  // Handle return location logic
  useEffect(() => {
    if (!tripDetails.differentReturnLocation) {
      // If same location, swap pickup and destination for return
      setTripDetails(prev => ({
        ...prev,
        returnPickup: prev.destination,
        returnDestination: prev.pickup
      }));
    }
  }, [tripDetails.pickup, tripDetails.destination, tripDetails.differentReturnLocation]);

  const fetchBuses = async () => {
    try {
      const response = await fetch('/api/buses');
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error('Failed to fetch buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTripTime = async () => {
    if (!tripDetails.pickup || !tripDetails.destination || !tripDetails.departTime || !tripDetails.passengers) return;
    if (tripType === 'roundtrip' && (!tripDetails.returnTime)) return;
    
    setCalculating(true);
    
    setTimeout(() => {
      const mockTravelTimes: { [key: string]: number } = {
        'Whistler': 2,
        'Downtown Vancouver': 0.75,
        'Fraser Valley Wineries': 1.5,
        'YVR Airport': 0.5,
        'BC Place': 0.5,
        'River Rock Casino': 0.75,
      };
      
      const outboundTime = mockTravelTimes[tripDetails.destination] || 1;
      
      if (tripType === 'roundtrip') {
        const returnTravelTime = mockTravelTimes[tripDetails.returnPickup || tripDetails.destination] || 1;
        
        const departDateTime = new Date(`${tripDetails.date} ${tripDetails.departTime}`);
        const returnDateTime = new Date(`${tripDetails.returnDate} ${tripDetails.returnTime}`);
        const totalMinutes = (returnDateTime.getTime() - departDateTime.getTime()) / (1000 * 60);
        const waitMinutes = totalMinutes - (outboundTime * 60);
        
        setWaitTime(Math.max(0, waitMinutes / 60));
        setEstimatedHours(outboundTime + returnTravelTime + Math.max(0, waitMinutes / 60));
      } else {
        setEstimatedHours(outboundTime);
        setWaitTime(null);
      }
      
      setCalculating(false);
    }, 1000);
  };

  const filteredBuses = buses.filter(bus => {
    const passengerCount = parseInt(tripDetails.passengers) || 0;
    if (passengerCount > bus.capacity) return false;
    return true;
  });

  const calculatePrice = (hourlyRate: number) => {
    if (!estimatedHours) return null;
    return Math.ceil(hourlyRate * estimatedHours);
  };

  const handleBooking = (busId: string) => {
    const params = new URLSearchParams({
      busId,
      pickup: tripDetails.pickup,
      destination: tripDetails.destination,
      date: tripDetails.date,
      departTime: tripDetails.departTime,
      passengers: tripDetails.passengers,
      hours: estimatedHours?.toString() || '',
      tripType,
      ...(tripType === 'roundtrip' && {
        returnPickup: tripDetails.returnPickup || tripDetails.destination,
        returnDestination: tripDetails.returnDestination || tripDetails.pickup,
        returnDate: tripDetails.returnDate || '',
        returnTime: tripDetails.returnTime || '',
      })
    });
    
    router.push(`/booking/create?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Home button */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <h1 className="text-4xl font-normal mb-2">
            Book your {tripType === 'roundtrip' ? 'round trip' : 'one way'} ride
          </h1>
          <p className="text-gray-600">
            {tripType === 'roundtrip' 
              ? 'Enter your trip details below' 
              : 'Direct service to your destination'}
          </p>
          
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => router.push('/search?type=roundtrip')}
              className={`px-4 py-2 rounded-lg ${
                tripType === 'roundtrip' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Round trip
            </button>
            <button
              onClick={() => router.push('/search?type=oneway')}
              className={`px-4 py-2 rounded-lg ${
                tripType === 'oneway' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              One way
            </button>
          </div>
          
          <div className="space-y-6 mt-8">
            {/* Main trip details */}
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pickup location</label>
                  <input
                    type="text"
                    placeholder="Enter pickup address"
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={tripDetails.pickup}
                    onChange={(e) => setTripDetails({...tripDetails, pickup: e.target.value})}
                    // Note: Google Places Autocomplete would be integrated here
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Destination</label>
                  <input
                    type="text"
                    placeholder="Enter destination"
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={tripDetails.destination}
                    onChange={(e) => setTripDetails({...tripDetails, destination: e.target.value})}
                    // Note: Google Places Autocomplete would be integrated here
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={tripDetails.date}
                    onChange={(e) => setTripDetails({...tripDetails, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pickup time</label>
                  <input
                    type="time"
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={tripDetails.departTime}
                    onChange={(e) => setTripDetails({...tripDetails, departTime: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Number of passengers</label>
                  <input
                    type="number"
                    placeholder="How many?"
                    className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={tripDetails.passengers}
                    onChange={(e) => setTripDetails({...tripDetails, passengers: e.target.value})}
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            </div>
            
            {/* Return trip section for round trips */}
            {tripType === 'roundtrip' && (
              <div className="border-t pt-6">
                <h3 className="font-medium mb-3">Return trip</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Return date</label>
                    <input
                      type="date"
                      className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      value={tripDetails.returnDate}
                      onChange={(e) => setTripDetails({...tripDetails, returnDate: e.target.value})}
                      min={tripDetails.date || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Return pickup time</label>
                    <input
                      type="time"
                      className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      value={tripDetails.returnTime}
                      onChange={(e) => setTripDetails({...tripDetails, returnTime: e.target.value})}
                    />
                  </div>
                </div>
                
                {/* Checkbox for different return location */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tripDetails.differentReturnLocation}
                      onChange={(e) => setTripDetails({...tripDetails, differentReturnLocation: e.target.checked})}
                      className="w-4 h-4 text-black rounded focus:ring-black"
                    />
                    <span className="text-sm">Different pickup/dropoff locations for return trip?</span>
                  </label>
                </div>
                
                {/* Only show if different return location is checked */}
                {tripDetails.differentReturnLocation && (
                  <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Return pickup location</label>
                      <input
                        type="text"
                        placeholder="Enter return pickup address"
                        className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        value={tripDetails.returnPickup}
                        onChange={(e) => setTripDetails({...tripDetails, returnPickup: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Return destination</label>
                      <input
                        type="text"
                        placeholder="Enter return destination"
                        className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        value={tripDetails.returnDestination}
                        onChange={(e) => setTripDetails({...tripDetails, returnDestination: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Calculate button */}
            <div>
              <button
                onClick={calculateTripTime}
                disabled={
                  !tripDetails.pickup || 
                  !tripDetails.destination || 
                  !tripDetails.departTime ||
                  !tripDetails.passengers ||
                  (tripType === 'roundtrip' && !tripDetails.returnTime) ||
                  calculating
                }
                className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition"
              >
                {calculating ? 'Calculating...' : 'Find vehicles & prices'}
              </button>
            </div>
          </div>
          
          {estimatedHours && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg">
                Total trip duration: <span className="font-medium">{estimatedHours.toFixed(1)} hours</span>
              </p>
              {tripType === 'roundtrip' && waitTime !== null && (
                <p className="text-sm text-gray-600 mt-1">
                  Includes {waitTime.toFixed(1)} hours between trips
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results section remains the same */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-400">Finding available vehicles...</div>
          </div>
        ) : (
          <>
            {estimatedHours && (
              <div className="mb-8">
                <p className="text-lg">{filteredBuses.length} vehicles available for your trip</p>
              </div>
            )}

            {!estimatedHours && (
              <div className="text-center py-12">
                <p className="text-gray-500">Enter your trip details to see available vehicles and prices</p>
              </div>
            )}

            {estimatedHours && (
              <div className="space-y-4">
                {filteredBuses.map((bus) => {
                  const price = calculatePrice(bus.hourlyRate);
                  
                  return (
                    <div key={bus.id} className="border rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-medium mb-1">{bus.name}</h3>
                          <p className="text-gray-500 mb-4">{bus.operator.companyName}</p>
                          
                          <div className="flex gap-6 text-sm">
                            <span>
                              <span className="text-gray-500">Capacity:</span> {bus.capacity} passengers
                            </span>
                            <span>
                              <span className="text-gray-500">Location:</span> {bus.operator.city}
                            </span>
                          </div>

                          {bus.features.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {bus.features.slice(0, 3).map((feature, idx) => (
                                <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="text-right ml-6">
                          <p className="text-2xl font-light mb-1">
                            ${price}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            ${bus.hourlyRate}/hr × {estimatedHours.toFixed(1)}hrs
                          </p>
                          <button
                            onClick={() => handleBooking(bus.id)}
                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {estimatedHours && filteredBuses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No vehicles available for your requirements</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}