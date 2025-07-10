import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/admin/operators"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Operator Management</h2>
            <p className="text-gray-600">View and approve operator registrations</p>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow opacity-50 cursor-not-allowed">
            <h2 className="text-xl font-semibold mb-2">Bookings</h2>
            <p className="text-gray-600">View all bookings (Coming soon)</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow opacity-50 cursor-not-allowed">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-gray-600">Platform statistics (Coming soon)</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow opacity-50 cursor-not-allowed">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600">Platform configuration (Coming soon)</p>
          </div>
        </div>
        
        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}