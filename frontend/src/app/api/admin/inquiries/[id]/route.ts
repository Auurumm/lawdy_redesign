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
      const { data: inquiry, error } = await supabaseAdmin
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !inquiry) {
        return NextResponse.json(
          { error: '문의를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ inquiry });
    } catch (error) {
      console.error('Get inquiry error:', error);
      return NextResponse.json(
        { error: '문의를 가져오는데 실패했습니다.' },
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
      const { status, admin_memo } = body;

      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (status) updateData.status = status;
      if (admin_memo !== undefined) updateData.admin_memo = admin_memo;

      const { data: inquiry, error } = await supabaseAdmin
        .from('inquiries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ inquiry });
    } catch (error) {
      console.error('Update inquiry error:', error);
      return NextResponse.json(
        { error: '문의 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
