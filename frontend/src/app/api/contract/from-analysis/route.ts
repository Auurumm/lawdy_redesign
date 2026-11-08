import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// 내가 생성한 모든 계약서 목록(분석 기반 + 직접 작성) (최신순, 본인 것만)
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const limit = Math.min(parseInt(new URL(req.url).searchParams.get('limit') || '5'), 50);

      const { data, error } = await supabaseAdmin
        .from('generated_contracts')
        .select('id, title, content, created_at, source_document_id, party_a_name, party_b_name, documents:source_document_id(file_name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const contracts = (data || []).map((row) => {
        const doc = row.documents as unknown as { file_name: string } | { file_name: string }[] | null;
        const fileName = Array.isArray(doc) ? doc[0]?.file_name : doc?.file_name;
        return {
          id: row.id,
          title: row.title || '개선 계약서',
          content: row.content,
          createdAt: row.created_at,
          sourceDocumentId: row.source_document_id,
          partyA: row.party_a_name,
          partyB: row.party_b_name,
          sourceFileName: fileName || null,
        };
      });

      return NextResponse.json({ contracts });
    } catch (error) {
      console.error('Get contracts from analysis error:', error);
      return NextResponse.json({ error: '계약서 목록을 가져오는데 실패했습니다.' }, { status: 500 });
    }
  });
}
