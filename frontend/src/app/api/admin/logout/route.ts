import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/adminAuth';

export async function POST() {
  try {
    await clearAdminCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: '로그아웃에 실패했습니다.' },
      { status: 500 }
    );
  }
}
