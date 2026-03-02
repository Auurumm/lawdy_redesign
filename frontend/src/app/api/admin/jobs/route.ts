import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      const { data: jobs, error, count } = await supabaseAdmin
        .from('job_listings')
        .select('*', { count: 'exact' })
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
  });
}

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      const body = await req.json();
      const { title, description, team, location, employment_type, requirements, is_active, sort_order } = body;

      if (!title || !description || !team || !location || !employment_type) {
        return NextResponse.json(
          { error: '필수 항목을 모두 입력해주세요.' },
          { status: 400 }
        );
      }

      const { data: job, error } = await supabaseAdmin
        .from('job_listings')
        .insert({
          title,
          description,
          team,
          location,
          employment_type,
          requirements: requirements || [],
          is_active: is_active ?? true,
          sort_order: sort_order ?? 0,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ job });
    } catch (error) {
      console.error('Create job error:', error);
      return NextResponse.json(
        { error: '채용 정보 생성에 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
