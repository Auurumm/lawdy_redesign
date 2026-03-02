import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = (page - 1) * limit;

    const { data: jobs, error, count } = await supabaseAdmin
      .from('job_listings')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      data: jobs || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: '채용 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
