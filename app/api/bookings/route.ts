import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // First, create or find the customer
    let customer = await prisma.customer.findUnique({
      where: { email: data.customerEmail }
    });
    
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        }
      });
    }
    
    // Get the bus and operator info
    const bus = await prisma.bus.findUnique({
      where: { id: data.busId },
      include: { operator: true }
    });
    
    if (!bus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }
    
    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        busId: data.busId,
        operatorId: bus.operator.id,
        
        // Trip details
        date: new Date(data.date),
        startTime: data.departTime,
        hours: parseInt(data.hours),
        
        pickupLocation: data.pickup,
        dropoffLocation: data.destination,
        
        totalPrice: parseFloat(data.totalPrice),
        depositAmount: parseFloat(data.depositAmount),
        
        status: 'confirmed', // Auto-confirm for MVP
        
        // Initialize empty photo arrays
        preRidePhotos: [],
        postRidePhotos: [],
      },
      include: {
        customer: true,
        bus: {
          include: {
            operator: true
          }
        }
      }
    });
    
    // Here you would:
    // 1. Send confirmation email to customer
    // 2. Send notification to operator
    // 3. Process payment with Stripe
    // 4. Schedule reminder notifications
    
    console.log('New booking created:', booking.id);
    
    return NextResponse.json(booking);
    
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// GET bookings (for testing)
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        bus: {
          include: {
            operator: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}