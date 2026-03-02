import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  getRefreshToken,
  hashToken,
  clearAuthCookies,
} from '@/lib/auth';

export async function POST() {
  try {
    // Refresh Token 가져오기
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { error: '리프레시 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // Token 검증
    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch {
      await clearAuthCookies();
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // DB에서 Refresh Token 확인
    const tokenHash = hashToken(refreshToken);
    const { data: storedToken } = await supabaseAdmin
      .from('refresh_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('revoked', false)
      .single();

    if (!storedToken) {
      await clearAuthCookies();
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 만료 확인
    if (new Date(storedToken.expires_at) < new Date()) {
      await clearAuthCookies();
      return NextResponse.json(
        { error: '토큰이 만료되었습니다.' },
        { status: 401 }
      );
    }

    // 사용자 확인
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, name')
      .eq('id', payload.userId)
      .single();

    if (!user) {
      await clearAuthCookies();
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 401 }
      );
    }

    // 기존 토큰 무효화
    await supabaseAdmin
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('token_hash', tokenHash);

    // 새 토큰 생성
    const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // 새 Refresh Token 저장
    const newTokenHash = hashToken(newRefreshToken);
    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: user.id,
      token_hash: newTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      revoked: false,
    });

    // 쿠키 설정
    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Refresh error:', error);
    await clearAuthCookies();
    return NextResponse.json(
      { error: '토큰 갱신에 실패했습니다.' },
      { status: 500 }
    );
  }
}
