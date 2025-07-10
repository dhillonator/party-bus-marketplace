import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create operator and their first bus in one transaction
    const operator = await prisma.operator.create({
      data: {
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        buses: {
          create: {
            name: data.busName,
            capacity: data.capacity,
            hourlyRate: 200, // Default rate, operators can update later
            minimumHours: 4,
            features: [],
            description: ''
          }
        }
      },
      include: {
        buses: true
      }
    });
    
    // Here you would also send a welcome email
    console.log('New operator registered:', operator);
    
    return NextResponse.json(operator);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register operator' },
      { status: 500 }
    );
  }
}

// GET all operators (for testing)
export async function GET() {
  try {
    const operators = await prisma.operator.findMany({
      include: {
        buses: true
      }
    });
    
    return NextResponse.json(operators);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operators' },
      { status: 500 }
    );
  }
}