'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';

interface BusDetails {
  id: string;
  name: string;
  hourlyRate: number;
  operator: {
    companyName: string;
  };
}

export default function CreateBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [bus, setBus] = useState<BusDetails | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Get all trip details from URL
  const tripDetails = {
    busId: searchParams.get('busId') || '',
    pickup: searchParams.get('pickup') || '',
    destination: searchParams.get('destination') || '',
    date: searchParams.get('date') || '',
    departTime: searchParams.get('departTime') || '',
    passengers: parseInt(searchParams.get('passengers') || '0'),
    hours: parseFloat(searchParams.get('hours') || '0'),
    tripType: searchParams.get('tripType') || 'oneway',
    // Round trip details
    returnPickup: searchParams.get('returnPickup') || '',
    returnDestination: searchParams.get('returnDestination') || '',
    returnDate: searchParams.get('returnDate') || '',
    returnTime: searchParams.get('returnTime') || '',
  };

  useEffect(() => {
    // Fetch bus details
    const fetchBus = async () => {
      try {
        const response = await fetch('/api/buses');
        const buses = await response.json();
        const selectedBus = buses.find((b: any) => b.id === tripDetails.busId);
        setBus(selectedBus);
      } catch (error) {
        console.error('Failed to fetch bus:', error);
      }
    };
    
    if (tripDetails.busId) {
      fetchBus();
    }
  }, [tripDetails.busId]);

  const totalPrice = bus ? Math.ceil(bus.hourlyRate * tripDetails.hours) : 0;
  const serviceFee = Math.ceil(totalPrice * 0.15);
  const finalTotal = totalPrice + serviceFee;
  const deposit = bus ? bus.hourlyRate * 2 : 0;

  const handleBooking = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer information');
      return;
    }

    setLoading(true);

    try {
      // Create booking in database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tripDetails,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          totalPrice: finalTotal,
          depositAmount: deposit,
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        // Redirect to trip page
        router.push(`/trip/${booking.id}`);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/search" className="flex items-center gap-2 text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete your booking</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left side - Booking details */}
          <div className="md:col-span-2 space-y-6">
            {/* Trip Summary */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold mb-4">Trip summary</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Pickup</p>
                    <p className="text-sm text-gray-600">{tripDetails.pickup}</p>
                    <p className="text-sm text-gray-600">{tripDetails.date} at {tripDetails.departTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Destination</p>
                    <p className="text-sm text-gray-600">{tripDetails.destination}</p>
                  </div>
                </div>

                {tripDetails.tripType === 'roundtrip' && (
                  <>
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm text-gray-600 mb-2">Return trip</p>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">Return pickup</p>
                          <p className="text-sm text-gray-600">{tripDetails.returnPickup}</p>
                          <p className="text-sm text-gray-600">{tripDetails.returnDate} at {tripDetails.returnTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Final destination</p>
                        <p className="text-sm text-gray-600">{tripDetails.returnDestination}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-6 pt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {tripDetails.passengers} passengers
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {tripDetails.hours} hours total
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold mb-4">Your information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full name</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="(604) 555-0123"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold mb-4">Payment</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your card will be charged now. A security deposit will be held separately.
              </p>
              
              {/* Simplified payment form for MVP */}
              <div className="p-4 bg-gray-50 rounded text-center">
                <p className="text-sm text-gray-600">
                  Payment integration coming soon. For MVP testing, bookings will be created without payment.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Price summary */}
          <div>
            <div className="bg-white rounded-lg p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Price details</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{bus.name}</p>
                  <p className="text-sm text-gray-600">{bus.operator.companyName}</p>
                </div>

                <div className="space-y-2 py-3 border-y">
                  <div className="flex justify-between text-sm">
                    <span>Base price ({tripDetails.hours} hours × ${bus.hourlyRate}/hr)</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${finalTotal}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Security deposit (hold)</span>
                  <span>${deposit}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
                className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
              >
                {loading ? 'Creating booking...' : `Confirm booking • $${finalTotal}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By booking, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}