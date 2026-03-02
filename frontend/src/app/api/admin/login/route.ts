import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateAdminToken, verifyAdminPassword, setAdminCookie } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, password_hash, name')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const isValid = await verifyAdminPassword(password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const token = generateAdminToken({
      adminId: admin.id,
      username: admin.username,
    });

    await setAdminCookie(token);

    return NextResponse.json({
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: '로그인에 실패했습니다.' },
      { status: 500 }
    );
  }
}
