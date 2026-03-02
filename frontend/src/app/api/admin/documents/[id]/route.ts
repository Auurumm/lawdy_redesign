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
      const { data: document, error } = await supabaseAdmin
        .from('documents')
        .select(`
          *,
          users!documents_user_id_fkey (email, name),
          analyses (*),
          chat_messages (id, role, content, created_at)
        `)
        .eq('id', id)
        .single();

      if (error || !document) {
        return NextResponse.json(
          { error: '문서를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      let downloadUrl = null;
      if (document.storage_path) {
        const { data: signedUrlData } = await supabaseAdmin.storage
          .from('documents')
          .createSignedUrl(document.storage_path, 3600);
        downloadUrl = signedUrlData?.signedUrl;
      }

      return NextResponse.json({
        document: {
          ...document,
          user_email: document.users?.email || 'Unknown',
          user_name: document.users?.name || 'Unknown',
          download_url: downloadUrl,
        },
      });
    } catch (error) {
      console.error('Get document error:', error);
      return NextResponse.json(
        { error: '문서를 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
