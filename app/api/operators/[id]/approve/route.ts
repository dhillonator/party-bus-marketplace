import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const operatorId = params.id;
    
    // Update operator approval status
    const operator = await prisma.operator.update({
      where: {
        id: operatorId,
      },
      data: {
        isApproved: true,
      },
    });
    
    // Here you would send an approval email to the operator
    console.log(`Operator ${operator.companyName} approved!`);
    
    return NextResponse.json(operator);
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: 'Failed to approve operator' },
      { status: 500 }
    );
  }
}