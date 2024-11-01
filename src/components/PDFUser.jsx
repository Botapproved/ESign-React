import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { ChevronLeft, ChevronRight, Link, CheckCircle, Camera, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import supabase from '../../utils/supabase';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFUser = ({ template, role }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  const [signatureImage, setSignatureImage] = useState(null);
  const [placedSignatures, setPlacedSignatures] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allSignaturesCompleted, setAllSignaturesCompleted] = useState(false);

  const pdfContainerRef = useRef();
  const signatureRef = useRef();
  console.log("template signs:",template.sign_slots)

  const embedSignatureIntoPDF = async (imageDataUrl, position, size, pageIndex) => {
    try {
      // Convert base64 image data URL to Uint8Array
      const imageData = await fetch(imageDataUrl);
      const imageBytes = await imageData.arrayBuffer();

  
      const pages = pdfDoc.getPages();
      const page = pages[pageIndex];


      const { width: pageWidth, height: pageHeight } = page.getSize();
      const pdfX = (position.x / pageWidth) * pageWidth;
      const pdfY = pageHeight - ((position.y / pageHeight) * pageHeight) - size.height; // Flip Y coordinate

      // Embed the image
      const signatureImage = await pdfDoc.embedPng(imageBytes);
      
      page.drawImage(signatureImage, {
        x: pdfX,
        y: pdfY,
        width: size.width,
        height: size.height,
      });

      return true;
    } catch (error) {
      console.error('Error embedding signature:', error);
      return false;
    }
  };

    // Validate template prop
  useEffect(() => {
    if (!template) {
      setError('Template is required');
      return;
    }

    if (!template.pdf_link) {
      setError('PDF link is missing from template');
      return;
    }

    // Ensure sign_slots is an array
    if (!template.sign_slots || !Array.isArray(template.sign_slots)) {
      console.warn('sign_slots is missing or not an array, initializing as empty array');
      template.sign_slots = [];
    }
  }, [template]);

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


  useEffect(() => {
    const updatePageWidth = () => {
      if (pdfContainerRef.current) {
        const containerWidth = pdfContainerRef.current.offsetWidth;
        setPageWidth(containerWidth - 32);
      }
    };
    
    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);

    return () => {
      window.removeEventListener('resize', updatePageWidth);
    };
  }, []);

  useEffect(() => {

  const loadPDF = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(template.pdf_link);
      if (!response.ok) throw new Error('Failed to fetch PDF');
      
      const pdfBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      setPdfDoc(pdfDoc);
      setPdfFile(template.pdf_link);
      
      const pages = pdfDoc.getPages();
      const { width, height } = pages[0].getSize();
      setPageSize({ width, height });
      
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading PDF from URL:', error);
      setError('Failed to load PDF from URL. Please check the URL and try again.');
      setPdfFile(null);
      setPdfDoc(null);
    } finally {
      setIsLoading(false);
    }
  };
  loadPDF();
  }, [template?.pdf_link]);

  

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const onPageLoadSuccess = ({ width, height }) => {
    setPageWidth(width);
    setPageHeight(height);
  };

  const changePage = (offset) => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + offset;
      return Math.min(Math.max(1, newPage), numPages);
    });
  };

  const handleSignatureUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Convert uploaded image to PNG format
        const reader = new FileReader();
        reader.onload = async (e) => {
          // Create temporary image to get dimensions
          const img = new Image();
          img.onload = () => {
            // Create canvas to convert to PNG
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Convert to PNG
            const pngDataUrl = canvas.toDataURL('image/png');
            setSignatureImage(pngDataUrl);
            setIsDialogOpen(false);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing signature image:', error);
        setError('Failed to process signature image. Please try again.');
      }
    }
  };

  const handleSignatureDraw = async () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL();
      setSignatureImage(dataUrl);
      setIsDialogOpen(false);
    }
  };

  const findNextSignaturePage = (currentPage) => {
    const nextSignature = template.sign_slots.find(
      (sig) => sig.page > currentPage && 
               sig.role === role && 
               !placedSignatures[`${sig.page}-${sig.role}`]
    );
    return nextSignature ? nextSignature.page : null;
  };

  const handlePlaceSignature = async () => {
    const currentSignature = template.sign_slots.find(
      sig => sig.page === currentPage && sig.role === role
    );

    if (currentSignature) {
      try {
        // Embed the signature into the PDF
        const success = await embedSignatureIntoPDF(
          signatureImage,
          currentSignature.position,
          currentSignature.size,
          currentPage - 1 // PDF pages are 0-based
        );

        if (!success) {
          throw new Error('Failed to embed signature');
        }

   
        setPlacedSignatures(prev => ({
          ...prev,
          [`${currentPage}-${role}`]: {
            image: signatureImage,
            position: currentSignature.position,
            size: currentSignature.size
          }
        }));

        const nextPage = findNextSignaturePage(currentPage);
        if (!nextPage) {
          setAllSignaturesCompleted(true);
        } else {
          setCurrentPage(nextPage);
        }
      } catch (error) {
        console.error('Error placing signature:', error);
        setError('Failed to place signature. Please try again.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
  

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
     
      const link = document.createElement('a');
      link.href = url;
      link.download = 'signed_document.pdf';
      link.click();
      
  
      const timestamp = Date.now();
      const fileName = `signed_document_${timestamp}.pdf`;
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true, 
        });
  
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
  
      // the file link in the s3
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);
  
      
      const { error: dbError } = await supabase
        .from('pdfTemplates') 
        .update({ pdf_link: publicUrl }) 
        .eq('id', template.id); 
  
      if (dbError) throw new Error(`Database update failed: ${dbError.message}`);
  
      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading and uploading PDF:', error);
      setError('Failed to download and upload PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentPageNeedsSignature = template.sign_slots && template.sign_slots.some(
    sig => sig.page === currentPage && 
           sig.role === role && 
           !placedSignatures[`${sig.page}-${role}`]
  );
  

  const hasSignatureOnPage = (pageNumber) => {
    return Object.keys(placedSignatures).some(key => key.startsWith(`${pageNumber}-`));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">PDF Signer</h1>

        {pdfFile && (
          <div ref={pdfContainerRef} className="relative">
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

            <div className="border rounded-lg overflow-hidden">
              <div className="relative">
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page
                    pageNumber={currentPage}
                    width={pageWidth}
                    height={pageHeight}
                    onLoadSuccess={onPageLoadSuccess}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  >
                    {/* Show signature boxes */}
                    {template.sign_slots
                      .filter(sig => sig.page === currentPage && sig.role === role)
                      .map((sig) => (
                        <div
                          key={`${sig.page}-${sig.role}`}
                          className="absolute border-2 border-blue-500 bg-blue-50 rounded-lg shadow-lg"
                          style={{
                            width: sig.size.width,
                            height: sig.size.height,
                            left: sig.position.x,
                            top: sig.position.y
                          }}
                        >
                          {/* Show placed signature if it exists */}
                          {placedSignatures[`${sig.page}-${sig.role}`] && (
                            <img 
                              src={placedSignatures[`${sig.page}-${sig.role}`].image} 
                              alt="Signature" 
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      ))}
                  </Page>
                </Document>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              {!signatureImage ? (
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Signature
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reupload Signature
                  </button>
                  {currentPageNeedsSignature && (
                    <button
                      onClick={handlePlaceSignature}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      Place Sign on this Page
                      <CheckCircle size={20} />
                    </button>
                  )}
                </>
              )}
              {allSignaturesCompleted && (
                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Download size={20} />
                  Download Signed PDF
                </button>
              )}
            </div>
          </div>
        )}

        {/* Signature Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Add Your Signature</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Upload Signature</h3>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">Image files only</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleSignatureUpload} accept="image/*" />
                  </label>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Draw Signature</h3>
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'border rounded-lg w-full h-40 bg-white'
                    }}
                  />
                  <button
                    onClick={handleSignatureDraw}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Signature
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsDialogOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUser;