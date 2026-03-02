import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const status = searchParams.get('status');
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('support_requests')
        .select('*', { count: 'exact' })
        .order('support_level', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: requests, error, count } = await query;

      if (error) throw error;

      return NextResponse.json({
        data: requests || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      });
    } catch (error) {
      console.error('Get support requests error:', error);
      return NextResponse.json(
        { error: '지원 요청 목록을 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
