import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabaseAuthEmail } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';
import { randomUUID } from 'crypto';

// Supabase Auth에서 기존 사용자 삭제 (재전송 보장)
async function deleteSupabaseAuthUser(email: string) {
  try {
    const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const authUser = data?.users?.find((u: { email?: string }) => u.email === email);
    if (authUser) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.id);
    }
  } catch (e) {
    console.error('Failed to delete existing Supabase Auth user:', e);
  }
}

// Supabase Auth signUp으로 인증 이메일 발송
async function sendVerificationEmail(email: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lawdy.cloud';
  const emailRedirectTo = `${appUrl}/auth/callback`;

  // 기존 Supabase Auth 사용자 삭제 (이미 confirmed 상태면 signUp이 이메일을 보내지 않으므로)
  await deleteSupabaseAuthUser(email);

  const { error } = await supabaseAuthEmail.auth.signUp({
    email,
    password: randomUUID(),
    options: { emailRedirectTo },
  });

  if (error) {
    console.error('Supabase Auth signUp error:', error.message);
  }
}

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
      .select('id, email_verified')
      .eq('email', email)
      .single();

    if (existingUser) {
      // 이미 가입했지만 미인증 상태 → 인증 메일 재전송
      if (!existingUser.email_verified) {
        await sendVerificationEmail(email);

        return NextResponse.json({
          needsVerification: true,
          email,
          message: '인증 메일을 재전송했습니다. 이메일을 확인해주세요.',
        });
      }

      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // 사용자 생성 (email_verified = false)
    const { error } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        agreed_terms: agreeTerms,
        agreed_privacy: agreePrivacy,
        email_verified: false,
      });

    if (error) throw error;

    // 인증 이메일 발송
    await sendVerificationEmail(email);

    // JWT 토큰 미발급 - 이메일 인증 완료 후 로그인 필요
    return NextResponse.json({
      needsVerification: true,
      email,
      message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입에 실패했습니다.' },
      { status: 500 }
    );
  }
}
