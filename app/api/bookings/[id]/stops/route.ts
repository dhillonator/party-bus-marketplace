import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Create a new stop request
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const data = await request.json();
    
    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        bus: true,
        operator: true 
      }
    });
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    // Calculate additional cost (mock calculation)
    const detourMinutes = 10; // In production, use Google Maps API
    const totalMinutes = detourMinutes + data.estimatedDuration;
    let additionalCost = (totalMinutes / 60) * booking.bus.hourlyRate;
    
    // Add premium for long stops
    if (totalMinutes > 30) {
      additionalCost *= 1.2;
    }
    
    // Minimum $25
    additionalCost = Math.max(25, Math.round(additionalCost));
    
    // Create stop request (would need to add this model to your schema)
    const stopRequest = {
      id: Date.now().toString(),
      bookingId,
      address: data.stopAddress,
      estimatedDuration: data.estimatedDuration,
      additionalCost,
      status: 'pending',
      requestedAt: new Date()
    };
    
    // In production: 
    // - Save to database
    // - Send notification to driver
    // - Set up webhook for Stripe payment
    
    return NextResponse.json({
      stopRequest,
      message: 'Stop request sent to driver'
    });
    
  } catch (error) {
    console.error('Stop request error:', error);
    return NextResponse.json(
      { error: 'Failed to create stop request' },
      { status: 500 }
    );
  }
}

// Get stop requests for a booking
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
    // In production, fetch from database
    const mockStopRequests = [
      {
        id: '1',
        bookingId,
        address: '123 Main St, Vancouver',
        estimatedDuration: 15,
        additionalCost: 50,
        status: 'approved',
        requestedAt: new Date(Date.now() - 3600000),
        approvedAt: new Date(Date.now() - 3500000)
      }
    ];
    
    return NextResponse.json(mockStopRequests);
    
  } catch (error) {
    console.error('Fetch stops error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stop requests' },
      { status: 500 }
    );
  }
}