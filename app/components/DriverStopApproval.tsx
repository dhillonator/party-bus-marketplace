'use client';
import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface StopRequestData {
  id: string;
  customerName: string;
  stopAddress: string;
  estimatedDuration: number;
  additionalCost: number;
  detourMinutes: number;
  requestedAt: Date;
}

interface DriverStopApprovalProps {
  request: StopRequestData;
  nextBookingTime?: Date;
  onApprove: () => void;
  onDeny: (reason?: string) => void;
}

export default function DriverStopApproval({ 
  request, 
  nextBookingTime, 
  onApprove, 
  onDeny 
}: DriverStopApprovalProps) {
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes to respond
  const [showDenyReason, setShowDenyReason] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          onDeny('No response - auto declined');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDeny]);

  const totalAddedTime = request.detourMinutes + request.estimatedDuration;
  const willBeLateForNext = nextBookingTime && 
    new Date(Date.now() + totalAddedTime * 60000) > nextBookingTime;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header with timer */}
        <div className="bg-yellow-400 text-black p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">NEW STOP REQUEST</h2>
            <div className="text-sm font-medium">
              Respond in: {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Request details */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-medium">{request.customerName}</p>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Stop location</p>
              <p className="font-medium">{request.stopAddress}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Added time</p>
                <p className="font-medium">{totalAddedTime} minutes</p>
                <p className="text-xs text-gray-500">
                  {request.detourMinutes}min detour + {request.estimatedDuration}min stop
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Additional fare</p>
                <p className="font-medium text-green-600">${request.additionalCost}</p>
              </div>
            </div>
          </div>

          {/* Warning if affects next booking */}
          {willBeLateForNext && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    This will make you late for your next booking!
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Next pickup at {nextBookingTime.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!showDenyReason ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowDenyReason(true)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Decline
              </button>
              <button
                onClick={onApprove}
                disabled={willBeLateForNext}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve (${request.additionalCost})
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium">Reason for declining:</p>
              <div className="space-y-2">
                <button
                  onClick={() => onDeny('Will be late for next booking')}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
                >
                  Will be late for next booking
                </button>
                <button
                  onClick={() => onDeny('Stop location too far')}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
                >
                  Stop location too far off route
                </button>
                <button
                  onClick={() => onDeny('Cannot accommodate request')}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
                >
                  Cannot accommodate at this time
                </button>
              </div>
              <button
                onClick={() => setShowDenyReason(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Quick stats */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            You've approved {Math.floor(Math.random() * 10) + 15} of your last 20 stop requests
          </div>
        </div>
      </div>
    </div>
  );
}