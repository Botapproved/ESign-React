import React from 'react';
import { useNavigate } from 'react-router-dom';

function Frontpage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/pdf-template-creator');
  };

  const handleTalkToUsClick = () => {
    // Add your contact/support navigation logic here
    console.log('Talk to us clicked');
  };

  return (
    <div className="h-screen bg-gradient-to-br pt-4  from-purple-50 to-gray-300 bg-blend-multiply flex flex-col relative overflow-hidden">
      <div className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 z-10 flex flex-col">
        <div className="text-center pt-16 pb-12 mx-auto text-gray-800">
          <h1 className="text-4xl md:text-6xl font-bold animate-pulse">ESign: Easy Signature</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 animate-bounce">Simplify. Automate. Thrive.</p>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 mt-6 relative bottom-5 z-10 bg-gray-900 shadow-xl rounded-lg transition-all duration-300 hover:shadow-2xl mb-6">
          {/* Top Row */}
          <div className="absolute top-8 w-full flex flex-col border-b border-gray-400 pb-5 sm:flex-row justify-between px-4 sm:px-8">
            <p className="text-xs font-medium pt-2 max-w-[200px] hidden sm:block text-gray-400">
              Your Digital Transformation Partner
            </p>
            <div className="flex px-6 items-center flex-row sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={handleGetStartedClick}
                className="relative group z-10 hover:border-r-8 border-gray-700 overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-xl hover:scale-100  active:scale-95"
              >
                <span className="relative z-10"> GET STARTED</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={handleTalkToUsClick}
                className="relative group z-10 hover:border-r-8 border-gray-600 overflow-hidden bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-medium transition-all duration-600 hover:shadow-xl hover:scale-105 active:scale-95 hover:border-gray-300"
              >
                <span className="relative z-10"> CONTACT US</span>
                <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
          

          {/* Interactive Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
          
            {/* Left Feature Button */}
            <button className="absolute scale-[70%] sm:scale-100 -left-4 sm:z-0 z-10 hover:z-100 sm:left-16 group bg-gray-700 hover:bg-purple-600 transition-all duration-300 px-6 py-3 rounded-full text-sm font-medium text-gray-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95">
              <span className="group-hover:text-white hover:z-100">Digital Signatures</span>
            </button>

            <svg viewBox="0 0 400 400" className="sm:w-[70%] h-auto animate-spin-slow  max-w-[500px] opacity-80">
              <defs>
                <linearGradient id="petal-left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#333" />
                  <stop offset="100%" stopColor="#666" />
                </linearGradient>
                <linearGradient id="petal-right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#666" />
                  <stop offset="100%" stopColor="#999" />
                </linearGradient>
              </defs>
              {Array.from({ length: 12 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 30} 200 200)`}>
                  <path
                    d="M200,80 L160,200 L200,320 L200,80 Z"
                    fill="url(#petal-left)"
                    style={{
                      transformOrigin: 'center',
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                    }}
                  />
                  <path
                    d="M200,80 L240,200 L200,320 L200,80 Z"
                    fill="url(#petal-right)"
                    style={{
                      transformOrigin: 'center',
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* Right Feature Button */}
            <button className="absolute scale-[70%] sm:scale-100 -right-4 sm:right-16 group bg-gray-700  transition-all duration-300 px-6 py-3 rounded-full text-sm font-medium text-gray-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95">
              <span className="group-hover:text-white">Workflow Automation</span>
            </button>
          </div>
        

          {/* Feature Text */}
          <div className="absolute bottom-8 w-full  pb-2 flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 space-y-4 sm:space-y-0">
            <div className="text-center pl-4 flex-1">
              <p className="text-sm font-semibold mb-1 hover:scale-105 text-gray-400">Optimized Workflows</p>
              <p className="text-xs text-gray-500">
                Boost productivity with digital efficiency
              </p>
            </div>

            <div className="text-center sm:pt-20 flex-1">
              <p className="text-sm font-semibold mb-1 hover:scale-105 text-gray-400">Secure Transactions</p>
              <p className="text-xs text-gray-500">
                Industry-leading encryption to safeguard your data
              </p>
            </div>

            <div className="text-center pr-4 flex-1">
              <p className="text-sm font-semibold mb-1 hover:scale-105 text-gray-400">Advanced Customization</p>
              <p className="text-xs text-gray-500">
                Tailor eSign workflows to your unique business needs
              </p>
            </div>
          </div>

          
     
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none flex items-end overflow-hidden">
        <div className="h-full w-full bg-gradient-to-t from-gray-900 to-transparent" />
      </div>
    </div>
  );
}

export default Frontpage;