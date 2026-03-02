import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async (req, adminId) => {
    try {
      const { data: admin, error } = await supabaseAdmin
        .from('admin_users')
        .select('id, username, name')
        .eq('id', adminId)
        .single();

      if (error || !admin) {
        return NextResponse.json(
          { error: '관리자 정보를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ admin });
    } catch (error) {
      console.error('Get admin error:', error);
      return NextResponse.json(
        { error: '관리자 정보를 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
