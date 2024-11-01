import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import PDFSigner from './components/PDFSigner';
import PDFTemplateCreator from './components/PDFTemplateCreator';
import PDFUserWrapper from './components/PDFUserWrapper';

import './App.css';
import Footer from './components/Footer';
import DocumentSelector from './components/DocumentSelector';
import Frontpage from './components/Frontpage';
function App() {


  return (
    <>
    <Router>
      <Routes>
        <Route path="/pdf-signer" element={<PDFSigner />} />
        <Route path="/pdf-template-creator" element={<PDFTemplateCreator />} />
        <Route path="/pdf-user/:id" element={<PDFUserWrapper />} />
        <Route path="/" element={<DocumentSelector />} />
        <Route path="/info" element={<Frontpage/>} />
        <Route path="/sign/:templateId/:accessToken" element={<PDFUserWrapper />} />
      </Routes>
    </Router>
    <Footer/>
    </>
    
  );
}

export default App;