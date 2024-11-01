import supabase from '../../utils/supabase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentSelector = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedRole, setSelectedRole] = useState('Client');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('pdfTemplates')  // Ensure this matches your table name
        .select('id, created_at, pdf_link, sign_slots') // Fixed field names
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the documents
      const processedDocs = data.map(doc => ({
        ...doc,
        createdDate: new Date(doc.created_at).toLocaleDateString(),
        createdTime: new Date(doc.created_at).toLocaleTimeString(),
        signatureCount: doc.sign_slots?.length || 0,
        fileName: doc.pdf_link.split('/').pop()
      }));

      console.log('Fetched documents:', processedDocs);
      setDocuments(processedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDoc) {
      navigate(`/pdf-user/${selectedDoc}?role=${encodeURIComponent(selectedRole)}`); // Wrapped in quotes
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Select Document to Sign</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document</label>
            {documents.length === 0 ? (
              <div className="text-gray-500 p-4 border rounded-md">
                No documents available. Please create a template first.
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                {documents.map((doc) => (
                  <label
                    key={doc.id}
                    className={`flex items-start p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                      selectedDoc === doc.id ? 'bg-blue-50' : ''
                    }`} 
                  >
                    <input
                      type="radio"
                      name="document"
                      value={doc.id}
                      checked={selectedDoc === doc.id}
                      onChange={(e) => setSelectedDoc(e.target.value)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium">Template #{doc.id}</div>
                      <div className="text-sm text-gray-500">
                        Created: {doc.createdDate} at {doc.createdTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        Signature Fields: {doc.signatureCount}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        File: {doc.fileName}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Client">Client</option>
              <option value="Manager">Manager</option>
              <option value="Telemarketer">Telemarketer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedDoc}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Continue to Signing
          </button>
        </form>
      </div>
    </div>
  );
};



export default DocumentSelector;
