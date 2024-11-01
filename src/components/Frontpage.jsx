import { useState } from 'react';
import React from 'react';
import DocumentSelector from './DocumentSelector';

 function Frontpage() {
    const [showDocumentSelector, setShowDocumentSelector] = useState(false);

    const handleGetStartedClick = () => {
      setShowDocumentSelector(true);
    };
  
    if (showDocumentSelector) {
      return <DocumentSelector />;
    }
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Heading */}
        <div className="text-center pt-16 pb-12">
          <h1 className="text-[3.5rem] leading-tight font-bold tracking-tight">
            Streamlined Operations
            <br />
            Maximized Revenue
          </h1>
        </div>

        {/* Main Content Area */}
        <div className="relative min-h-[600px] bg-gray-50 rounded-lg">
          {/* Top Row */}
          <div className="absolute top-8 w-full flex justify-between px-8">
            <p className="text-sm font-medium max-w-[200px]">
              Empowering
              <br />
              Entrepreneurs for Success
            </p>
            <div className="flex gap-4">
              <button onClick={() => ShowDocumentSelector()} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
                GET STARTED
              </button>
              <button className="bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-medium">
                CONTACT SALES
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
            <button className="absolute left-16 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 px-4 py-2 rounded-full text-sm font-medium">
              Digital Signatures
            </button>

            <svg viewBox="0 0 400 400" className="w-[500px] h-[500px]">
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
            <button className="absolute right-16 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 px-4 py-2 rounded-full text-sm font-medium">
              Workflow Automation
            </button>
          </div>

          {/* Feature Text */}
          <div className="absolute bottom-8 w-full flex justify-between items-start px-8">
            <div className="text-center flex-1">
              <p className="text-sm font-medium mb-2">Streamlined Processes</p>
              <p className="text-xs text-gray-600">Simplify workflows and amplify profits</p>
              <p className="text-xs text-gray-600">with our intuitive platform</p>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-sm font-medium mb-2">Customizable Solutions</p>
              <p className="text-xs text-gray-600">Tailor your eSignature experience</p>
              <p className="text-xs text-gray-600">to fit your unique business needs</p>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-sm font-medium mb-2">Dedicated Support</p>
              <p className="text-xs text-gray-600">"Our commitment goes beyond</p>
              <p className="text-xs text-gray-600">mere transactions"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Frontpage;