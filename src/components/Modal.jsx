import React from 'react';

const Modal = ({ isOpen, onClose, rolesWithLinks }) => {
  if (!isOpen) return null;

  const handleSendEmail = (role, link) => {
    const subject = encodeURIComponent('Please Sign');
    const body = encodeURIComponent(`Please visit the link to get to this document: ${link}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-11/12 max-w-md border border-gray-200 transform transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Template Saved Successfully</h2>
        <div className="space-y-4 mb-6">
          {rolesWithLinks.map((item) => (
            <div 
              key={item.role} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-grow">
                <div className="text-gray-600 font-medium">{item.role}</div>
                <a 
                  href={item.link} 
                  className="text-blue-600 text-sm truncate block max-w-[200px] hover:underline"
                >
                  {item.link}
                </a>
              </div>
              <button 
                onClick={() => handleSendEmail(item.role, item.link)} 
                className="ml-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                aria-label={`Send email to ${item.role}`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;