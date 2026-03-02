import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const redirectTo = new URL('/login', appUrl);

  if (!token_hash || !type) {
    redirectTo.searchParams.set('error', 'missing_params');
    return NextResponse.redirect(redirectTo);
  }

  try {
    // Supabase 클라이언트로 OTP 검증
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { flowType: 'implicit', autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email',
    });

    if (error || !data?.user?.email) {
      redirectTo.searchParams.set('error', 'verification_failed');
      return NextResponse.redirect(redirectTo);
    }

    // users 테이블 email_verified 업데이트
    await supabaseAdmin
      .from('users')
      .update({ email_verified: true })
      .eq('email', data.user.email);

    redirectTo.searchParams.set('verified', 'true');
    return NextResponse.redirect(redirectTo);
  } catch {
    redirectTo.searchParams.set('error', 'server_error');
    return NextResponse.redirect(redirectTo);
  }
}
