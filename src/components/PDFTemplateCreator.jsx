import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import { Camera, ChevronLeft, ChevronRight, Link, Trash2, Plus, Move } from 'lucide-react';
import supabase from '../../utils/supabase';
import Modal from "./Modal";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFTemplateCreator = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageHeight, setPageHeight] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rolesWithLinks, setRolesWithLinks] = useState([]);
  
  // State for signature fields
  const [signatureFields, setSignatureFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  
  // Available roles
  const roles = ['Client', 'Telemarketer', 'Manager'];
  
  const pdfContainerRef = useRef();
  const pageRef = useRef();

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  

  useEffect(() => {
    const updatePageDimensions = () => {
      if (pdfContainerRef.current) {
        const containerWidth = pdfContainerRef.current.offsetWidth;
        setPageWidth(containerWidth - 32);
      }
    };
    
    updatePageDimensions();
    window.addEventListener('resize', updatePageDimensions);
    return () => window.removeEventListener('resize', updatePageDimensions);
  }, []);

  const onPageLoadSuccess = useCallback(({ width, height }) => {
    setPageHeight(height);
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(fileUrl);
      setCurrentPage(1);
      setSignatureFields([]);
      setSelectedField(null);
    }
  };

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  }, []);

  const changePage = (offset) => {
    setCurrentPage(prevPage => {
      const newPage = prevPage + offset;
      return Math.min(Math.max(1, newPage), numPages);
    });
  };

  const addSignatureField = () => {
    // Calculate center position of the current view
    const centerX = pageWidth / 2 - 75; // Half of signature box width
    const centerY = 100; // Fixed initial Y position from top

    const newField = {
      id: Date.now(),
      page: currentPage,
      position: { x: centerX, y: centerY },
      size: { width: 150, height: 50 },
      role: roles[0],
      sequence: signatureFields.length + 1
    };
    setSignatureFields(prev => [...prev, newField]);
    setSelectedField(newField.id);
  };

  const updateFieldPosition = (id, position) => {
    setSignatureFields(fields => 
      fields.map(field => 
        field.id === id ? { ...field, position } : field
      )
    );
  };

  const updateFieldRole = (id, role) => {
    setSignatureFields(fields =>
      fields.map(field =>
        field.id === id ? { ...field, role } : field
      )
    );
  };

  const deleteField = (id) => {
    setSignatureFields(fields => {
      const updatedFields = fields.filter(field => field.id !== id);

      return updatedFields.map((field, index) => ({
        ...field,
        sequence: index + 1
      }));
    });
    setSelectedField(null);
  };

  const saveTemplate = async () => {
    if (signatureFields.length === 0) {
      alert('Please add at least one signature field before saving.');
      return;
    }
  
    try {
      setIsLoading(true);
      setError('');
      // Generate unique ID for the document aka the template_id
    const uniqueId = generateUniqueId();
    console.log(uniqueId);
    const uniqueRoles = [...new Set(signatureFields.map(field => field.role))];

    const roleTokens = uniqueRoles.map(role => ({
      role,
      accessToken: generateUniqueId() 
    }));
    console.log("Role assignments:", roleTokens);
  
      // 1. Upload PDF to storage bucket
      const timestamp = Date.now();
      const fileName = `template_${timestamp}.pdf`;
      
      // Upload to default public bucket
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, uploadedFile, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
  
      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);
  
      // 3. Save template data to database
      const { data, error: dbError } = await supabase
        .from('pdfTemplates')
        .insert([{
          template_id: uniqueId,  
          sign_slots: signatureFields,
          pdf_link: publicUrl,
          created_at: new Date().toISOString(),
          roles: roleTokens // roles to json with idss
        }])
        .select();
  
      if (dbError) throw new Error(`Database save failed: ${dbError.message}`);
      const roleLinks = roleTokens.map(({ role, accessToken }) => ({
        role,
        link: `${window.location.origin}/sign/${uniqueId}/${accessToken}`
      }));
  
      setRolesWithLinks(roleLinks);
      setShowModal(true);
  
      alert('Template saved successfully!');
      const templateUrl = `${window.location.origin}/pdf-user/${uniqueId}?role=${roles[0]}`; // Example for sending to Client
      console.log("Share this URL with the user:", templateUrl);

      

      
    } catch (error) {
      console.error('Error saving template:', error);
      setError(`Failed to save template: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">PDF Template Creator</h1>

        {/* File Upload */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Camera className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Upload PDF Template</p>
              <p className="text-xs text-gray-500 mt-1">Drag and drop or click to select</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} accept="application/pdf" />
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* PDF Preview */}
        {pdfFile && (
          <div ref={pdfContainerRef} className="relative">
            {/* Page Navigation */}
            <div className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded-lg">
              <button 
                onClick={() => changePage(-1)} 
                disabled={currentPage <= 1} 
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm">Page {currentPage} of {numPages}</span>
              <button 
                onClick={() => changePage(1)} 
                disabled={currentPage >= numPages} 
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* PDF Viewer with Signature Fields */}
            <div className="border rounded-lg overflow-hidden">
              <div className="relative">
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page
                    pageNumber={currentPage}
                    width={pageWidth}
                    inputRef={pageRef}
                    onLoadSuccess={onPageLoadSuccess}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                  
                  {/* Signature Fields */}
                  <div className="absolute top-0 left-0 w-full  h-full">
                    {signatureFields
                      .filter(field => field.page === currentPage)
                      .map((field) => (
                        <Draggable
                          key={field.id}
                          position={field.position}
                          onStop={(e, data) => updateFieldPosition(field.id, { x: data.x, y: data.y })}
                          bounds="parent"
                        >
                          <div
                            className={`absolute cursor-move ${
                              selectedField === field.id
                                ? 'border-2 border-blue-500 bg-blue-50'
                                : 'border-2 border-gray-400 bg-white'
                            } rounded-lg shadow-lg`}
                            style={{ width: field.size.width*1.18, height: field.size.height }}
                            onClick={() => setSelectedField(field.id)}
                          >
                            {/* Signature Field Header */}
                            <div className="flex items-center min-w-50 justify-between p-2 bg-gray-50 border-b">
                              <div className="flex items-center gap-2">
                                <Move size={16} className="text-gray-500" />
                                <select
                                  value={field.role}
                                  onChange={(e) => updateFieldRole(field.id, e.target.value)}
                                  className="text-sm bg-white rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteField(field.id);
                                }}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {/* Sequence Number */}
                            <div className="absolute bottom-1 right-2 text-xs text-gray-500">
                              #{field.sequence}
                            </div>
                          </div>
                        </Draggable>
                      ))}
                  </div>
                </Document>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={addSignatureField}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add Signature Field
              </button>
              <button
                onClick={saveTemplate}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        )}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} rolesWithLinks={rolesWithLinks} />
      </div>
    </div>
  );
};

export default PDFTemplateCreator;