import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 클라이언트 캐시
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;
let supabaseAuthEmailInstance: SupabaseClient | null = null;

// 지연 초기화 (빌드 시 에러 방지)
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is missing');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

function getSupabaseAdminClient(): SupabaseClient {
  if (supabaseAdminInstance) return supabaseAdminInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is missing');
  }

  supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return supabaseAdminInstance;
}

// 이메일 인증 전용 Supabase 클라이언트 (Supabase Auth signUp으로 이메일 발송 트리거)
function getSupabaseAuthEmailClient(): SupabaseClient {
  if (supabaseAuthEmailInstance) return supabaseAuthEmailInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is missing');
  }

  supabaseAuthEmailInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'implicit',
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return supabaseAuthEmailInstance;
}

// 클라이언트용 Supabase (제한된 권한)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// 서버용 Supabase (관리자 권한, API Routes에서만 사용)
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseAdminClient();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// 이메일 인증 전용 Supabase (anon key, implicit flow)
export const supabaseAuthEmail = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseAuthEmailClient();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
