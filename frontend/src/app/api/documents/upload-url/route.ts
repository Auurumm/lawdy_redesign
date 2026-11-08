import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAuth } from '@/lib/auth';

// 확장자 기준 허용 형식 (브라우저가 file.type을 비워 보내는 경우 대비)
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt'];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

// POST: 업로드용 서명 URL 발급 + 문서 레코드 생성
// 파일 본문은 브라우저가 Supabase Storage로 직접 올린다 (Vercel 4.5MB 요청 제한 우회)
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const { fileName, fileSize } = await req.json();

      if (!fileName || typeof fileName !== 'string') {
        return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 });
      }

      const extension = (fileName.split('.').pop() || '').toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return NextResponse.json(
          { error: '지원하지 않는 파일 형식입니다. (PDF, DOC, DOCX, TXT만 가능)' },
          { status: 400 }
        );
      }

      if (typeof fileSize === 'number' && fileSize > MAX_SIZE) {
        return NextResponse.json(
          { error: '파일 크기가 너무 큽니다. (최대 50MB)' },
          { status: 400 }
        );
      }

      const storagePath = `${userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { data: signed, error: signError } = await supabaseAdmin.storage
        .from('documents')
        .createSignedUploadUrl(storagePath);

      if (signError || !signed) {
        console.error('Signed upload URL error:', signError);
        return NextResponse.json(
          { error: '업로드 준비에 실패했습니다. 다시 시도해주세요.' },
          { status: 500 }
        );
      }

      const { data: document, error } = await supabaseAdmin
        .from('documents')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_type: extension,
          file_size: typeof fileSize === 'number' ? fileSize : null,
          storage_path: storagePath,
          status: 'uploading',
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        signedUrl: signed.signedUrl,
        token: signed.token,
        document,
      });
    } catch (error) {
      console.error('Upload URL error:', error);
      return NextResponse.json(
        { error: '문서 업로드 준비에 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
