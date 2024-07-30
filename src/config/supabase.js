import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({path:'./config.env'});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
// console.log(supabase);

export default supabase;
