import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Only get buses from approved operators
    const buses = await prisma.bus.findMany({
      where: {
        isActive: true,
        operator: {
          isApproved: true
        }
      },
      include: {
        operator: {
          select: {
            id: true,
            companyName: true,
            city: true,
          }
        }
      }
    });
    
    return NextResponse.json(buses);
  } catch (error) {
    console.error('Failed to fetch buses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buses' },
      { status: 500 }
    );
  }
}