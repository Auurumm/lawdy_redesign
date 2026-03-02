import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabaseAuthEmail } from '@/lib/supabase';
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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: '이메일을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 존재 + 미인증 확인
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email_verified')
      .eq('email', email)
      .single();

    if (!user) {
      // 보안: 사용자 존재 여부를 노출하지 않음
      return NextResponse.json({
        success: true,
        message: '인증 메일이 전송되었습니다.',
      });
    }

    if (user.email_verified) {
      return NextResponse.json(
        { error: '이미 인증된 이메일입니다.' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lawdy.vercel.app';
    const emailRedirectTo = `${appUrl}/auth/callback`;

    // 기존 Supabase Auth 사용자 삭제 후 새로 생성 (확실한 이메일 발송)
    await deleteSupabaseAuthUser(email);

    const { data, error } = await supabaseAuthEmail.auth.signUp({
      email,
      password: randomUUID(),
      options: { emailRedirectTo },
    });

    if (error) {
      console.error('Supabase Auth signUp error on resend:', error);
    } else {
      console.log('Resend verification: signUp success, user id:', data?.user?.id);
    }

    return NextResponse.json({
      success: true,
      message: '인증 메일이 전송되었습니다.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: '인증 메일 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}
