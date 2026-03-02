import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    // Supabase Auth 토큰으로 사용자 정보 검증
    const { data: { user: supabaseUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !supabaseUser?.email) {
      return NextResponse.json(
        { error: '유효하지 않거나 만료된 인증 링크입니다.' },
        { status: 400 }
      );
    }

    // users 테이블에서 해당 이메일의 email_verified 업데이트
    const { data: user, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ email_verified: true })
      .eq('email', supabaseUser.email)
      .select('id, email')
      .single();

    if (updateError || !user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '이메일 인증이 완료되었습니다.',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: '이메일 인증에 실패했습니다.' },
      { status: 500 }
    );
  }
}
