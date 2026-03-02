import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAuth } from '@/lib/auth';

// GET: 문서 목록 조회
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const status = searchParams.get('status');
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('documents')
        .select(
          `
          *,
          analyses (
            id,
            risk_level,
            risk_score,
            summary,
            created_at
          )
        `,
          { count: 'exact' }
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: documents, error, count } = await query;

      if (error) throw error;

      return NextResponse.json({
        data: documents || [],
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

// POST: 문서 업로드
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { error: '파일을 선택해주세요.' },
          { status: 400 }
        );
      }

      // 파일 타입 검증
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: '지원하지 않는 파일 형식입니다. (PDF, DOC, DOCX, TXT만 가능)' },
          { status: 400 }
        );
      }

      // 파일 크기 검증 (50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: '파일 크기가 너무 큽니다. (최대 50MB)' },
          { status: 400 }
        );
      }

      // 파일 타입 추출
      const fileTypeMap: Record<string, string> = {
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'text/plain': 'txt',
      };

      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const fileExtension = file.name.split('.').pop() || 'pdf';
      const storagePath = `${userId}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from('documents')
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json(
          { error: '파일 업로드에 실패했습니다. 다시 시도해주세요.' },
          { status: 500 }
        );
      }

      const { data: document, error } = await supabaseAdmin
        .from('documents')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_type: fileTypeMap[file.type] || 'unknown',
          file_size: file.size,
          storage_path: storagePath,
          status: 'uploading',
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ document });
    } catch (error) {
      console.error('Upload document error:', error);
      return NextResponse.json(
        { error: '문서 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}
