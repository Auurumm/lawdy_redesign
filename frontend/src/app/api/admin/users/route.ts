import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const suspended = searchParams.get('suspended');
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('users')
        .select('id, email, name, created_at, suspended', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (suspended === 'true') {
        query = query.eq('suspended', true);
      } else if (suspended === 'false') {
        query = query.eq('suspended', false);
      }

      const { data: users, error, count } = await query;

      if (error) throw error;

      return NextResponse.json({
        data: users || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      });
    } catch (error) {
      console.error('Get users error:', error);
      return NextResponse.json(
        { error: '회원 목록을 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
