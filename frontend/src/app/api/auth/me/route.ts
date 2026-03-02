import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name, created_at')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return NextResponse.json(
          { error: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      return NextResponse.json(
        { error: '사용자 정보를 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
