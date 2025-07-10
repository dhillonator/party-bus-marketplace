import Link from 'next/link';

export default function OperatorSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for joining PartyBus Connect. We've received your application and will review it within 24 hours.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold mb-3">What happens next?</h2>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. We'll verify your business information</li>
              <li>2. You'll receive an email with your operator dashboard login</li>
              <li>3. You can add more buses and set your availability</li>
              <li>4. Start receiving bookings immediately after approval!</li>
            </ol>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Back to Home
            </Link>
            
            <p className="text-sm text-gray-600">
              Questions? Contact us at support@partybusconnect.ca
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}