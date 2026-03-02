import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { clearAuthCookies, getRefreshToken, hashToken } from '@/lib/auth';

export async function POST() {
  try {
    // Refresh Token 가져오기
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      // Refresh Token 무효화
      const tokenHash = hashToken(refreshToken);
      await supabaseAdmin
        .from('refresh_tokens')
        .update({ revoked: true })
        .eq('token_hash', tokenHash);
    }

    // 쿠키 삭제
    await clearAuthCookies();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // 에러가 발생해도 쿠키는 삭제
    await clearAuthCookies();
    return NextResponse.json({ success: true });
  }
}
