import React from 'react';

const Modal = ({ isOpen, onClose, rolesWithLinks }) => {
  if (!isOpen) return null;

  // Function to handle sending email
  const handleSendEmail = (role, link) => {
    const subject = encodeURIComponent('Please Sign');
    const body = encodeURIComponent(`Please visit the link to get to this document: ${link}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">Template Saved Successfully!</h2>
        <div className="mb-4">
          {rolesWithLinks.map((item) => (
            <div key={item.role} className="mb-2 flex items-center justify-between">
              <div>
                <strong>{item.role}:</strong> <a href={item.link} className="text-blue-600 hover:underline">{item.link}</a>
              </div>
              <button 
                onClick={() => handleSendEmail(item.role, item.link)} 
                className="ml-2 text-blue-600 hover:underline mt-6 "
                aria-label={`Send email to ${item.role}`}
              >
                <svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 494.09 494.09" xml:space="preserve">
<path id="XMLID_234_" d="M468.284,85.437H25.806C11.557,85.437,0,96.992,0,111.243v271.604c0,14.25,11.557,25.806,25.806,25.806
	h442.477c14.25,0,25.806-11.556,25.806-25.806V111.243C494.09,96.992,482.533,85.437,468.284,85.437z M451.363,341.569
	c6.997,5.814,7.961,16.197,2.154,23.193c-3.256,3.924-7.953,5.951-12.68,5.951c-3.708,0-7.439-1.248-10.511-3.796l-116.147-96.406
	l-56.616,46.988c-3.048,2.533-6.786,3.795-10.518,3.795c-3.731,0-7.471-1.262-10.519-3.795l-56.614-46.988L63.764,366.917
	c-6.989,5.814-17.37,4.857-23.194-2.155c-5.804-6.996-4.84-17.379,2.157-23.193l111.396-92.465L42.727,156.639
	c-6.997-5.814-7.961-16.197-2.157-23.193c5.824-6.996,16.205-7.953,23.194-2.155l183.28,152.128L430.326,131.29
	c6.996-5.798,17.385-4.841,23.191,2.155c5.807,6.997,4.842,17.379-2.154,23.193l-111.396,92.465L451.363,341.569z"/>
</svg>
              </button>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
