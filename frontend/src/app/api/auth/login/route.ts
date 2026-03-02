import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  hashToken,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 조회
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, password_hash')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 타입 안전성을 위한 캐스팅
    const userData = user as { id: string; email: string; name: string; password_hash: string };

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(password, userData.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 토큰 생성
    const accessToken = generateAccessToken({ userId: userData.id, email: userData.email });
    const refreshToken = generateRefreshToken({ userId: userData.id, email: userData.email });

    // 기존 Refresh Token 무효화
    await supabaseAdmin
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('user_id', userData.id)
      .eq('revoked', false);

    // 새 Refresh Token 저장
    const refreshTokenHash = hashToken(refreshToken);
    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: userData.id,
      token_hash: refreshTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      revoked: false,
    });

    // 쿠키 설정
    await setAuthCookies(accessToken, refreshToken);

    // 비밀번호 해시 제외하고 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = userData;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인에 실패했습니다.' },
      { status: 500 }
    );
  }
}
