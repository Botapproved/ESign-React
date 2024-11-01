import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../utils/supabase';
import PDFUser from './PDFUser';

const PDFUserWrapper = () => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { templateId, accessToken } = useParams();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // role verification
        const { data, error } = await supabase
          .from('pdfTemplates')
          .select('*')
          .eq('template_id', templateId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Template not found');

        // veerify access token and get role
        const roleMatch = data.roles.find(rt => rt.accessToken === accessToken);
        if (!roleMatch) throw new Error('Invalid access token');

       
        if (typeof data.sign_slots === 'string') {
          data.sign_slots = JSON.parse(data.sign_slots);
        }

        setTemplate({
          ...data,
          userRole: roleMatch.role 
        });

      } catch (error) {
        console.error('Error fetching template:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (templateId && accessToken) {
      fetchTemplate();
    }
  }, [templateId, accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Template not found</p>
      </div>
    );
  }

  return <PDFUser template={template} role={template.userRole} />;
};

export default PDFUserWrapper;