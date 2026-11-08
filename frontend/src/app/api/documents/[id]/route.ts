import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAuth } from '@/lib/auth';

// GET: 문서 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, userId) => {
    try {
      const { id } = await params;

      const { data: document, error } = await supabaseAdmin
        .from('documents')
        .select(
          `
          *,
          analyses (
            id,
            risk_level,
            risk_score,
            summary,
            risk_items,
            created_at
          )
        `
        )
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !document) {
        return NextResponse.json(
          { error: '문서를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ document });
    } catch (error) {
      console.error('Get document error:', error);
      return NextResponse.json(
        { error: '문서를 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}

// DELETE: 문서 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, userId) => {
    try {
      const { id } = await params;

      // 문서 조회 (권한 확인)
      const { data: document, error: findError } = await supabaseAdmin
        .from('documents')
        .select('id, file_url, storage_path')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (findError || !document) {
        return NextResponse.json(
          { error: '문서를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // Storage에서 파일 삭제
      // 업로드는 storage_path에 경로를 저장한다 (file_url은 비어 있음)
      const filePath = document.storage_path || document.file_url;
      if (filePath) {
        await supabaseAdmin.storage
          .from('documents')
          .remove([filePath]);
      }

      // 문서 삭제 (CASCADE로 analyses도 삭제됨)
      const { error } = await supabaseAdmin
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete document error:', error);
      return NextResponse.json(
        { error: '문서 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
