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
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name, created_at, suspended, agreed_terms, agreed_privacy')
        .eq('id', id)
        .single();

      if (error || !user) {
        return NextResponse.json(
          { error: '회원을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const { count: documentCount } = await supabaseAdmin
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id);

      const { count: analysisCount } = await supabaseAdmin
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id);

      return NextResponse.json({
        user: {
          ...user,
          document_count: documentCount || 0,
          analysis_count: analysisCount || 0,
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      return NextResponse.json(
        { error: '회원 정보를 가져오는데 실패했습니다.' },
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
      const { suspended } = body;

      if (typeof suspended !== 'boolean') {
        return NextResponse.json(
          { error: '유효하지 않은 요청입니다.' },
          { status: 400 }
        );
      }

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .update({ suspended })
        .eq('id', id)
        .select('id, email, name, created_at, suspended')
        .single();

      if (error) throw error;

      return NextResponse.json({ user });
    } catch (error) {
      console.error('Update user error:', error);
      return NextResponse.json(
        { error: '회원 정보 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
