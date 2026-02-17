import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Real-Time Poll Rooms
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create polls, share instantly, and watch results update live. 
            No signup required. Just poll and go!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card hover:shadow-2xl transition-shadow duration-300 animate-slide-up">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Create Polls</h3>
            <p className="text-gray-600">
              Set up your question and options in seconds. Get a shareable link instantly.
            </p>
          </div>

          <div className="card hover:shadow-2xl transition-shadow duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Live Updates</h3>
            <p className="text-gray-600">
              Watch votes roll in real-time. No refresh needed—powered by WebSockets.
            </p>
          </div>

          <div className="card hover:shadow-2xl transition-shadow duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fair Voting</h3>
            <p className="text-gray-600">
              Built-in anti-abuse: IP tracking and browser fingerprinting prevent duplicate votes.
            </p>
          </div>

          <div className="card hover:shadow-2xl transition-shadow duration-300 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Persistent Storage</h3>
            <p className="text-gray-600">
              Your polls are saved. Share links that work anytime, anywhere.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/create" className="btn-primary inline-block text-lg">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Poll
            </span>
          </Link>
          <p className="text-sm text-gray-500 mt-4">Free • No signup • Instant sharing</p>
        </div>
      </div>
    </div>
  );
}
