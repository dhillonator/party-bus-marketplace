import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white z-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-medium">PartyBus Connect</h1>
              <div className="hidden md:flex gap-6">
                <Link href="/search" className="text-gray-700 hover:text-black">
                  Book
                </Link>
                <Link href="/operator/register" className="text-gray-700 hover:text-black">
                  Drive
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                href="/operator/register"
                className="px-4 py-2 text-black hover:bg-gray-100 rounded-full transition"
              >
                Become a driver
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
              >
                Book now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                Go anywhere<br />with PartyBus
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Request a ride for your group, hop in, and go.
              </p>
              
              {/* Trip Type Selection */}
              <div className="flex gap-4 mb-6">
                <Link
                  href="/search?type=roundtrip"
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
                >
                  Round trip
                </Link>
                <Link
                  href="/search?type=oneway"
                  className="bg-gray-100 text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  One way
                </Link>
              </div>
              
              <p className="text-sm text-gray-500">
                Round trip includes waiting time at your destination
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <span className="text-gray-400">Hero image placeholder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-medium mb-8">Popular destinations</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              href="/search?type=roundtrip&destination=Whistler" 
              className="bg-white p-6 rounded-lg hover:shadow-md transition"
            >
              <h4 className="text-xl font-medium mb-2">Whistler</h4>
              <p className="text-gray-600">
                Mountain adventures, ski trips, and scenic tours
              </p>
              <p className="text-sm text-gray-500 mt-2">~5 hours round trip</p>
            </Link>
            
            <Link 
              href="/search?type=roundtrip&destination=Downtown Vancouver" 
              className="bg-white p-6 rounded-lg hover:shadow-md transition"
            >
              <h4 className="text-xl font-medium mb-2">Downtown Vancouver</h4>
              <p className="text-gray-600">
                Gastown, Granville Street, Yaletown nightlife
              </p>
              <p className="text-sm text-gray-500 mt-2">~4 hours with wait time</p>
            </Link>
            
            <Link 
              href="/search?type=roundtrip&destination=Fraser Valley Wineries" 
              className="bg-white p-6 rounded-lg hover:shadow-md transition"
            >
              <h4 className="text-xl font-medium mb-2">Fraser Valley Wineries</h4>
              <p className="text-gray-600">
                Wine tasting tours in Langley & Abbotsford
              </p>
              <p className="text-sm text-gray-500 mt-2">~6 hours with stops</p>
            </Link>
            
            <Link 
              href="/search?type=oneway&destination=YVR Airport" 
              className="bg-white p-6 rounded-lg hover:shadow-md transition"
            >
              <h4 className="text-xl font-medium mb-2">YVR Airport</h4>
              <p className="text-gray-600">
                Group airport transfers and pickups
              </p>
              <p className="text-sm text-gray-500 mt-2">One way • 30-60 min</p>
            </Link>
            
            <Link 
              href="/search?type=roundtrip&destination=BC Place" 
              className="bg-white p-6 rounded-lg hover:shadow-md transition"
            >
              <h4 className="text-xl font-medium mb-2">BC Place & Rogers Arena</h4>
              <p className="text-gray-600">
                Canucks games, Lions games, concerts
              </p>
              <p className="text-sm text-gray-500 mt-2">~4 hours round trip</p>
            </Link>
            
            <Link 
              href="/search?type=roundtrip&destination=River Rock Casino" 
              className="bg-white p-6 rounded-lg hover:shadow-md transition"
            >
              <h4 className="text-xl font-medium mb-2">River Rock Casino</h4>
              <p className="text-gray-600">
                Richmond's entertainment destination
              </p>
              <p className="text-sm text-gray-500 mt-2">~5 hours with gaming time</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Focused on safety */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-medium mb-12">Focused on safety, wherever you go</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-medium mb-4">Our commitment to your safety</h4>
              <p className="text-gray-600 mb-6">
                With every safety feature and every standard in our Community Guidelines, 
                we're committed to helping to create a safe environment for our users.
              </p>
              <Link href="#" className="underline">
                Read about our Community Guidelines
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">Driver screening</h5>
                <p className="text-sm text-gray-600">
                  All drivers are vetted and must maintain proper commercial licensing
                </p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Damage protection</h5>
                <p className="text-sm text-gray-600">
                  Photo verification system protects both riders and drivers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">About us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/search" className="hover:text-white">Book</Link></li>
                <li><Link href="/operator/register" className="hover:text-white">Drive</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Help</Link></li>
                <li><Link href="#" className="hover:text-white">Safety</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Cities</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Vancouver</li>
                <li>Surrey</li>
                <li>Richmond</li>
                <li>Burnaby</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
            <p>© 2024 PartyBus Connect</p>
          </div>
        </div>
      </footer>
    </div>
  );
}