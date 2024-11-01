import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument } from 'pdf-lib';
import Draggable from 'react-draggable';
import { Camera, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Link } from 'lucide-react';


//pdfjs.GlobalWorkerOptions.workerSrc = //unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PDFSigner() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [signatureImage, setSignatureImage] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 30, y: -130});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [pageWidth, setPageWidth] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const signatureRef = useRef();
  const pdfContainerRef = useRef();
  const pageRef = useRef();

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

  const loadPdfFromUrl = async (url) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch PDF');
      
      const pdfBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      setPdfDoc(pdfDoc);
      setPdfFile(url);
      
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

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (pdfUrl.trim()) {
      loadPdfFromUrl(pdfUrl);
    }
  };

  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignatureImage(e.target.result);
        setIsDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileReader = new FileReader();
      
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        try {
          const pdfDoc = await PDFDocument.load(typedarray);
          setPdfDoc(pdfDoc);
          const fileUrl = URL.createObjectURL(file);
          setPdfFile(fileUrl);
          
          const pages = pdfDoc.getPages();
          const { width, height } = pages[0].getSize();
          setPageSize({ width, height });
        } catch (error) {
          console.error('Error loading PDF:', error);
          setError('Error loading PDF. Please try another file.');
        }
      };
      
      fileReader.readAsArrayBuffer(file);
    }
  };

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  }, []);

  const onPageLoadSuccess = useCallback(({ width }) => {
    setPageWidth(width);
  }, []);

  const changePage = (offset) => {
    setCurrentPage(prevPage => {
      const newPage = prevPage + offset;
      return Math.min(Math.max(1, newPage), numPages);
    });
  };

  const handleSignatureDraw = async () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL();
      setSignatureImage(dataUrl);
      setIsDialogOpen(false);
    }
  };

  const handleSavePDF = async () => {
    if (!pdfDoc || !signatureImage) {
      alert('Please add a signature before saving.');
      return;
    }

    try {
      const signatureBytes = await fetch(signatureImage).then(res => res.arrayBuffer());
      const signatureImg = await pdfDoc.embedPng(signatureBytes);
      
      const pages = pdfDoc.getPages();
      const currentPdfPage = pages[currentPage-1];
      const { width: pdfWidth, height: pdfHeight } = currentPdfPage.getSize();

      const pageElement = pageRef.current;
      const pageRect = pageElement?.getBoundingClientRect();
      if (!pageRect) throw new Error('Could not get page dimensions');

      const scaleX = pdfWidth / pageRect.width;
      const scaleY = pdfHeight / pageRect.height;
      console.log(scaleY);
        // Calculate signature dimensions after scaling
        const signatureWidth = 150 * scaleX;
        const signatureHeight = 50 * scaleY;

      const signX = signaturePosition.x * scaleX;
      // const signY = signaturePosition.y * scaleY * -1;
      // Modified Y-coordinate calculation
    // Convert from screen coordinates to PDF coordinates
      const screenY = pageRect.height + signaturePosition.y; // Invert Y coordinate
      const signY = pageRect.height - (screenY * scaleY) ; // Transform to PDF coordinates
      console.log("sign y: ",signY,"position y:",signaturePosition.y)
      // Corrected Y-coordinate calculation
    // In screen coordinates, Y increases downward from top
    // In PDF coordinates, Y increases upward from bottom
    // const yOffset = Math.abs(signaturePosition.y); // Get positive offset
    // const signY = pdfHeight - (yOffset * scaleY); // Transform to PDF coordinates
    
    // console.log({
    //   pageHeight: pageRect.height,
    //   pdfHeight,
    //   screenY: signaturePosition.y,
    //   scaledY: yOffset * scaleY,
    //   finalY: signY,
    //   scaleY
    // });



      currentPdfPage.drawImage(signatureImg, {
        x: signX,
        y: signY,
        width: 150 * scaleX,
        height: 50 * scaleY,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'signed_document.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving PDF:', error);
      setError('Error saving PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">PDF Signer</h1>

        {/* URL Input */}
        <form onSubmit={handleUrlSubmit} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="Enter PDF URL"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={isLoading || !pdfUrl.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load PDF'}
            </button>
          </div>
        </form>

        {/* File Upload */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Camera className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF files only</p>
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
            <div className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded-lg">
              <button onClick={() => changePage(-1)} disabled={currentPage <= 1} className="p-2 rounded hover:bg-gray-200 disabled:opacity-50">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm">Page {currentPage} of {numPages}</span>
              <button onClick={() => changePage(1)} disabled={currentPage >= numPages} className="p-2 rounded hover:bg-gray-200 disabled:opacity-50">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="border rounded-lg overflow-y-auto max-h-[800px]">
              <div className="flex justify-center">
                <div className="relative">
                  <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page
                      pageNumber={currentPage}
                      className="mx-auto"
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      inputRef={pageRef}
                      width={pageWidth}
                    />
                    
                    {signatureImage && (
                      <Draggable
                        bounds="parent"
                        position={signaturePosition}
                        onStop={(e, data) => setSignaturePosition({ x: data.x, y: data.y })}
                      >
                        <div className="absolute cursor-move">
                          <img src={signatureImage} alt="Signature" className="w-32 h-12 object-contain" />
                        </div>
                      </Draggable>
                    )}
                  </Document>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button onClick={() => setIsDialogOpen(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Signature
              </button>
              <button onClick={handleSavePDF} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Save Signed PDF
              </button>
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
                  <input type="file" onChange={handleSignatureUpload} accept="image/*" className="w-full" />
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Draw Signature</h3>
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'border rounded-lg w-full h-40 bg-white'
                    }}
                  />
                  <button onClick={handleSignatureDraw} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Signature
                  </button>
                </div>
              </div>

              <button onClick={() => setIsDialogOpen(false)} className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PDFSigner;