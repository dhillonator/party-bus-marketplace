'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Clock, DollarSign, Plus, Phone, MessageSquare } from 'lucide-react';
import StopRequest from '@/app/components/StopRequest';

interface TripData {
  id: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  customerName: string;
  busName: string;
  operatorName: string;
  driverPhone: string;
  
  pickup: string;
  destination: string;
  date: string;
  departTime: string;
  
  isRoundTrip: boolean;
  returnPickup?: string;
  returnDestination?: string;
  returnTime?: string;
  
  totalPrice: number;
  hourlyRate: number;
  estimatedHours: number;
  
  approvedStops: Array<{
    id: string;
    address: string;
    additionalCost: number;
    status: 'completed' | 'upcoming';
  }>;
}

export default function TripPage() {
  const params = useParams();
  const tripId = params.id as string;
  
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStopRequest, setShowStopRequest] = useState(false);
  
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${tripId}`);
        if (response.ok) {
          const booking = await response.json();
          
          setTripData({
            id: booking.id,
            status: booking.status === 'confirmed' ? 'upcoming' : booking.status,
            customerName: booking.customer.name,
            busName: booking.bus.name,
            operatorName: booking.bus.operator.companyName,
            driverPhone: booking.bus.operator.phone,
            
            pickup: booking.pickupLocation,
            destination: booking.dropoffLocation,
            date: new Date(booking.date).toLocaleDateString(),
            departTime: booking.startTime,
            
            isRoundTrip: false, // We'll need to add this to the schema
            
            totalPrice: booking.totalPrice,
            hourlyRate: booking.bus.hourlyRate,
            estimatedHours: booking.hours,
            
            approvedStops: [], // We'll implement this later
          });
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [tripId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading trip details...</p>
      </div>
    );
  }
  
  if (!tripData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Trip not found</p>
      </div>
    );
  }
  
  const totalWithStops = tripData.totalPrice + 
    tripData.approvedStops.reduce((sum, stop) => sum + stop.additionalCost, 0);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-medium mb-1">Your trip</h1>
              <p className="text-gray-600">{tripData.busName} • {tripData.operatorName}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                tripData.status === 'in_progress' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tripData.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-lg p-6">
          <h2 className="font-medium mb-4">Trip details</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium">{tripData.pickup}</p>
                <p className="text-sm text-gray-600">{tripData.departTime}</p>
              </div>
            </div>
            
            {tripData.approvedStops.map(stop => (
              <div key={stop.id} className="flex items-start gap-3 ml-1">
                <div className="w-px h-8 bg-gray-300 ml-1"></div>
                <div className="flex-1 -mt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{stop.address}</p>
                      <p className="text-xs text-gray-500">
                        Added stop • +${stop.additionalCost}
                        {stop.status === 'completed' && ' • ✓ Completed'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex items-start gap-3 ml-1">
              <div className="w-px h-8 bg-gray-300 ml-1"></div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-1" />
              <div className="flex-1">
                <p className="font-medium">{tripData.destination}</p>
                <p className="text-sm text-gray-600">Drop-off</p>
              </div>
            </div>
          </div>
          
          {tripData.isRoundTrip && (
            <div className="mt-8 pt-8 border-t space-y-4">
              <p className="text-sm text-gray-600 mb-4">Return trip</p>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium">{tripData.returnPickup}</p>
                  <p className="text-sm text-gray-600">{tripData.returnTime}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 ml-1">
                <div className="w-px h-8 bg-gray-300 ml-1"></div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1" />
                <div className="flex-1">
                  <p className="font-medium">{tripData.returnDestination}</p>
                  <p className="text-sm text-gray-600">Final drop-off</p>
                </div>
              </div>
            </div>
          )}
          
          {tripData.status === 'in_progress' && (
            <button
              onClick={() => setShowStopRequest(true)}
              className="mt-6 w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add a stop
            </button>
          )}
        </div>
        
        <div className="bg-white rounded-lg p-6">
          <h2 className="font-medium mb-4">Driver contact</h2>
          <div className="flex gap-3">
            
            <a
              href={`tel:${tripData.driverPhone}`}
              className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call driver
            </a>
            <button className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Message
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6">
          <h2 className="font-medium mb-4">Trip cost</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Base trip ({tripData.estimatedHours} hours)</span>
              <span>${tripData.totalPrice}</span>
            </div>
            
            {tripData.approvedStops.map(stop => (
              <div key={stop.id} className="flex justify-between text-sm">
                <span className="text-gray-600">Stop: {stop.address}</span>
                <span>+${stop.additionalCost}</span>
              </div>
            ))}
            
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>${totalWithStops}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Remember:</strong> Take photos of the vehicle interior before and after your trip 
            to protect against unfair damage claims.
          </p>
        </div>
      </div>
      
      {showStopRequest && (
        <StopRequest
          bookingId={tripData.id}
          currentLocation={tripData.pickup}
          hourlyRate={tripData.hourlyRate}
          onClose={() => setShowStopRequest(false)}
        />
      )}
    </div>
  );
}