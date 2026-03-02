import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  hashToken,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, agreeTerms, agreePrivacy } = await request.json();

    // 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!agreeTerms || !agreePrivacy) {
      return NextResponse.json(
        { error: '약관에 동의해주세요.' },
        { status: 400 }
      );
    }

    // 비밀번호 유효성 검사
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: '비밀번호는 8자 이상, 대문자와 숫자를 포함해야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // 사용자 생성
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        agreed_terms: agreeTerms,
        agreed_privacy: agreePrivacy,
      })
      .select('id, email, name')
      .single();

    if (error) throw error;

    // 토큰 생성
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // Refresh Token 저장
    const refreshTokenHash = hashToken(refreshToken);
    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: user.id,
      token_hash: refreshTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      revoked: false,
    });

    // 쿠키 설정
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입에 실패했습니다.' },
      { status: 500 }
    );
  }
}
