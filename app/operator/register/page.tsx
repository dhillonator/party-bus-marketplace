'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OperatorRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    city: '',
    busName: '',
    capacity: 20,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/operators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Registration successful! We\'ll contact you within 24 hours.');
        router.push('/operator/success');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2">Join PartyBus Connect</h1>
        <p className="text-center text-gray-600 mb-8">
          The Lower Mainland's premier party bus booking platform
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-semibold">🎉 Launch Special: First 3 months commission-free!</p>
            <p className="text-green-700 text-sm">Join now and pay $0 in fees until March 2025</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Vancouver Party Bus Co."
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="owner@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(604) 555-0123"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              >
                <option value="">Select your primary city</option>
                <option value="Vancouver">Vancouver</option>
                <option value="Surrey">Surrey</option>
                <option value="Richmond">Richmond</option>
                <option value="Burnaby">Burnaby</option>
                <option value="Coquitlam">Coquitlam</option>
                <option value="Langley">Langley</option>
                <option value="Delta">Delta</option>
                <option value="North Vancouver">North Vancouver</option>
                <option value="West Vancouver">West Vancouver</option>
                <option value="Abbotsford">Abbotsford</option>
              </select>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Add Your First Bus</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bus Name/Model</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="24 Passenger Luxury Party Bus"
                    value={formData.busName}
                    onChange={(e) => setFormData({...formData, busName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Passenger Capacity</label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="50"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Join Platform'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-600 mt-6">
            Questions? Email us at support@partybusconnect.ca
          </p>
        </div>
      </div>
    </div>
  );
}