import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const options = {
    // auth: {
    //   persistSession: true
    // },
    storage: {
      s3Config: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        bucket: import.meta.env.VITE_AWS_S3_BUCKET,
        region: 'south-east-1'  
      }
    }
  };
const supabase = createClient(supabaseUrl, supabaseKey,options);

export default supabase;