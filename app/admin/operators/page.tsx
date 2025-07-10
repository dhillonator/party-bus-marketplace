'use client';
import { useState, useEffect } from 'react';

interface Operator {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  isApproved: boolean;
  createdAt: string;
  buses: Array<{
    id: string;
    name: string;
    capacity: number;
  }>;
}

export default function AdminOperators() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const response = await fetch('/api/operators');
      const data = await response.json();
      setOperators(data);
    } catch (error) {
      console.error('Failed to fetch operators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (operatorId: string) => {
    try {
      const response = await fetch(`/api/operators/${operatorId}/approve`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Operator approved!');
        fetchOperators(); // Refresh the list
      }
    } catch (error) {
      alert('Failed to approve operator');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Operator Management</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Company</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">City</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Buses</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {operators.map((operator) => (
                <tr key={operator.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{operator.companyName}</div>
                    <div className="text-sm text-gray-500">
                      Joined {new Date(operator.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{operator.email}</div>
                    <div className="text-sm text-gray-500">{operator.phone}</div>
                  </td>
                  <td className="px-6 py-4">{operator.city}</td>
                  <td className="px-6 py-4">
                    {operator.buses.map((bus) => (
                      <div key={bus.id} className="text-sm">
                        {bus.name} ({bus.capacity} seats)
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    {operator.isApproved ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {!operator.isApproved && (
                      <button
                        onClick={() => handleApprove(operator.id)}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {operators.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No operators registered yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}