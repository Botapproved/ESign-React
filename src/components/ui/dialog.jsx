import React from 'react';

// Dialog component
export function Dialog({ isOpen, onClose, children }) {
    if (!isOpen) return null; // Don't render if not open
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }
  

// DialogTrigger component
export function DialogTrigger({ children, onClick }) {
  return (
    <button onClick={onClick} className="focus:outline-none">
      {children}
    </button>
  );
}

// DialogContent component
export function DialogContent({ children }) {
  return <div>{children}</div>;
}

// DialogHeader component
export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

// DialogTitle component
export function DialogTitle({ children }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}

// DialogDescription component
export function DialogDescription({ children }) {
  return <p className="text-gray-700">{children}</p>;
}
