import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../App.css'; // Ensure to import your CSS file

function Frontpage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/pdf-template-creator');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between relative overflow-hidden m-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 z-10">
        <div className="text-center pt-16 pb-12 sm:min-w-[50rem] max-w-full md:max-w-[50rem] lg:max-w-[75rem] xl:max-w-[150rem] mx-auto"></div>

        {/* Main Content Area */}
        <div className="relative min-h-[600px] z-10 mb-2 bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
          {/* Top Row */}
          <div className="absolute top-8 w-full flex flex-col sm:flex-row justify-between px-4 sm:px-8">
            <p className="text-sm font-medium max-w-[200px] hidden sm:block text-gray-600">
              Empowering
              <br />
              Businesses for Success
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={handleGetStartedClick}
                style={{ cursor: 'pointer' }}
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 hover:bg-gray-800"
              >
                GET STARTED
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 hover:bg-gray-100">
                CONTACT US
              </button>
            </div>
          </div>

          {/* Horizontal Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="h-px bg-gray-200 mt-24" />
            <div className="h-px bg-gray-200" />
            <div className="h-px bg-gray-200 mb-24" />
          </div>

          {/* Flower Design */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Left Feature Button */}
            <button className="absolute left-4 sm:left-16 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 px-4 py-2 rounded-full text-sm font-medium">
              Digital Signatures
            </button>

            <svg viewBox="0 0 400 400" className="w-[80%] h-auto max-w-[500px]">
              <defs>
                <linearGradient id="petal-left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#BBBBBB" />
                </linearGradient>
                <linearGradient id="petal-right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#BBBBBB" />
                  <stop offset="100%" stopColor="#888888" />
                </linearGradient>
              </defs>
              {Array.from({ length: 12 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 30} 200 200)`}>
                  {/* Left half of petal */}
                  <path
                    d="M200,80 L160,200 L200,320 L200,80 Z"
                    fill="url(#petal-left)"
                    style={{
                      transformOrigin: 'center',
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                    }}
                  />
                  {/* Right half of petal */}
                  <path
                    d="M200,80 L240,200 L200,320 L200,80 Z"
                    fill="url(#petal-right)"
                    style={{
                      transformOrigin: 'center',
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* Right Feature Button */}
            <button className="absolute right-4 sm:right-16 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 px-4 py-2 rounded-full text-sm font-medium">
              Workflow Automation
            </button>
          </div>

          {/* Feature Text */}
          <div className="absolute bottom-8 w-full flex flex-col sm:flex-row justify-between items-start px-4 sm:px-8">
            <div className="text-center flex-1 mb-4 sm:mb-0">
              <p className="text-sm font-medium mb-2 text-gray-700">Streamlined Processes</p>
              <p className="text-xs text-gray-600">Simplify workflows and amplify profits</p>
              <p className="text-xs text-gray-600">with our intuitive platform</p>
            </div>

            <div className="text-center flex-1 mb-4 sm:mb-0">
              <p className="text-sm font-medium mb-2 text-gray-700">Customizable Solutions</p>
              <p className="text-xs text-gray-600">Tailor your eSignature experience</p>
              <p className="text-xs text-gray-600">to fit your unique business needs</p>
            </div>

            <div className="text-center flex-1">
              <p className="text-sm font-medium mb-2 text-gray-700">Dedicated Support</p>
              <p className="text-xs text-gray-600">"Our commitment goes beyond</p>
              <p className="text-xs text-gray-600">mere transactions"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background GIF only in the bottom half */}
      <div className="absolute sm:block hidden inset-x-0 bottom-0 h-3/5 overflow-hidden">
        <div className="background-gif h-full w-full" />
      </div>
    </div>
  );
}

export default Frontpage;
