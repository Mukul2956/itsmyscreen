import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function initDatabase() {
  // Verify connection by checking if polls table exists
  try {
    const { error } = await supabase.from('polls').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database connection error:', error.message);
      console.log('📝 Make sure you ran the SQL schema in Supabase dashboard');
    } else {
      console.log('✅ Database connection established');
      console.log('✅ Supabase tables ready');
    }
  } catch (err) {
    console.error('❌ Failed to connect to Supabase:', err.message);
  }
}

export async function createPoll(question, options) {
  const pollId = uuidv4();
  
  // Insert poll
  const { error: pollError } = await supabase
    .from('polls')
    .insert({ id: pollId, question });
  
  if (pollError) throw pollError;
  
  // Insert options
  const optionsData = options.map((option, index) => ({
    id: uuidv4(),
    poll_id: pollId,
    text: option,
    position: index
  }));
  
  const { error: optionsError } = await supabase
    .from('options')
    .insert(optionsData);
  
  if (optionsError) throw optionsError;
  
  return pollId;
}

export async function getPoll(pollId) {
  // Get poll
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select('*')
    .eq('id', pollId)
    .single();
  
  if (pollError || !poll) return null;
  
  // Get options
  const { data: options, error: optionsError } = await supabase
    .from('options')
    .select('*')
    .eq('poll_id', pollId)
    .order('position');
  
  if (optionsError) return null;
  
  return {
    ...poll,
    options
  };
}

export async function vote(pollId, optionId, ip, fingerprint) {
  // Check if user already voted by IP
  const { data: existingVoteByIp } = await supabase
    .from('votes')
    .select('id')
    .eq('poll_id', pollId)
    .eq('ip_address', ip)
    .single();
  
  if (existingVoteByIp) {
    return { success: false, error: 'You have already voted from this IP address' };
  }
  
  // Check if user already voted by fingerprint
  const { data: existingVoteByFingerprint } = await supabase
    .from('votes')
    .select('id')
    .eq('poll_id', pollId)
    .eq('fingerprint', fingerprint)
    .single();
  
  if (existingVoteByFingerprint) {
    return { success: false, error: 'You have already voted from this browser' };
  }
  
  // Verify option belongs to poll
  const { data: option } = await supabase
    .from('options')
    .select('id')
    .eq('id', optionId)
    .eq('poll_id', pollId)
    .single();
  
  if (!option) {
    return { success: false, error: 'Invalid option' };
  }
  
  // Record vote
  const { error: voteError } = await supabase
    .from('votes')
    .insert({
      poll_id: pollId,
      option_id: optionId,
      ip_address: ip,
      fingerprint: fingerprint
    });
  
  if (voteError) {
    return { success: false, error: 'Failed to record vote' };
  }
  
  return { success: true };
}

export async function getVotes(pollId) {
  // Get all options for this poll with vote counts
  const { data: options } = await supabase
    .from('options')
    .select('id, text, position')
    .eq('poll_id', pollId)
    .order('position');
  
  if (!options) return [];
  
  // Get vote counts for each option
  const votesPromises = options.map(async (option) => {
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('option_id', option.id);
    
    return {
      option_id: option.id,
      option_text: option.text,
      vote_count: count || 0
    };
  });
  
  const votes = await Promise.all(votesPromises);
  return votes;
}
