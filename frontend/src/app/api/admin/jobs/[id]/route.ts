import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/adminAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdminAuth(request, async () => {
    const { id } = await params;
    try {
      const { data: job, error } = await supabaseAdmin
        .from('job_listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !job) {
        return NextResponse.json(
          { error: '채용 정보를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ job });
    } catch (error) {
      console.error('Get job error:', error);
      return NextResponse.json(
        { error: '채용 정보를 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdminAuth(request, async (req) => {
    const { id } = await params;
    try {
      const body = await req.json();
      const { title, description, team, location, employment_type, requirements, is_active, sort_order } = body;

      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (team !== undefined) updateData.team = team;
      if (location !== undefined) updateData.location = location;
      if (employment_type !== undefined) updateData.employment_type = employment_type;
      if (requirements !== undefined) updateData.requirements = requirements;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (sort_order !== undefined) updateData.sort_order = sort_order;

      const { data: job, error } = await supabaseAdmin
        .from('job_listings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ job });
    } catch (error) {
      console.error('Update job error:', error);
      return NextResponse.json(
        { error: '채용 정보 수정에 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdminAuth(request, async () => {
    const { id } = await params;
    try {
      const { error } = await supabaseAdmin
        .from('job_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete job error:', error);
      return NextResponse.json(
        { error: '채용 정보 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
