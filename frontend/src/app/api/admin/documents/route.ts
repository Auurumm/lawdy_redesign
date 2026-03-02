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
        .from('documents')
        .select(`
          *,
          users!documents_user_id_fkey (email),
          analyses (id, risk_level, risk_score, summary, risk_items, created_at)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: documents, error, count } = await query;

      if (error) throw error;

      const formattedDocs = (documents || []).map(doc => ({
        ...doc,
        user_email: doc.users?.email || 'Unknown',
        users: undefined,
      }));

      return NextResponse.json({
        data: formattedDocs,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      });
    } catch (error) {
      console.error('Get documents error:', error);
      return NextResponse.json(
        { error: '문서 목록을 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
