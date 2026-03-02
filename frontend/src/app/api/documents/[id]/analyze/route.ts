import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAuth } from '@/lib/auth';
import { parseDocument, analyzeContract } from '@/lib/upstage';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, userId) => {
    const startTime = Date.now();
    const { id } = await params;

    try {
      const { data: document, error: findError } = await supabaseAdmin
        .from('documents')
        .select('id, file_name, storage_path, status, parsed_content')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (findError || !document) {
        return NextResponse.json(
          { error: '문서를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      if (document.status === 'analyzing') {
        return NextResponse.json(
          { error: '이미 분석 중입니다.' },
          { status: 400 }
        );
      }

      await supabaseAdmin
        .from('documents')
        .update({ status: 'parsing' })
        .eq('id', id);

      let parsedContent = document.parsed_content;

      if (!parsedContent && document.storage_path) {
        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
          .from('documents')
          .download(document.storage_path);

        if (downloadError || !fileData) {
          throw new Error('파일을 다운로드할 수 없습니다.');
        }

        const arrayBuffer = await fileData.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        parsedContent = await parseDocument(fileBuffer, document.file_name);

        await supabaseAdmin
          .from('documents')
          .update({ parsed_content: parsedContent, status: 'analyzing' })
          .eq('id', id);
      } else {
        await supabaseAdmin
          .from('documents')
          .update({ status: 'analyzing' })
          .eq('id', id);
      }

      if (!parsedContent) {
        throw new Error('문서 내용을 파싱할 수 없습니다.');
      }

      const analysisResult = await analyzeContract(parsedContent);
      const processingTime = Date.now() - startTime;

      const { data: analysis, error } = await supabaseAdmin
        .from('analyses')
        .insert({
          document_id: id,
          user_id: userId,
          risk_level: analysisResult.riskLevel,
          risk_score: analysisResult.riskScore,
          summary: analysisResult.summary,
          risk_items: analysisResult.riskItems,
          key_clauses: analysisResult.keyClauses,
          recommendations: analysisResult.recommendations,
          processing_time_ms: processingTime,
        })
        .select()
        .single();

      if (error) throw error;

      await supabaseAdmin
        .from('documents')
        .update({ status: 'completed' })
        .eq('id', id);

      const formattedAnalysis = {
        id: analysis.id,
        riskLevel: analysis.risk_level,
        riskScore: analysis.risk_score,
        summary: analysis.summary,
        riskItems: analysis.risk_items || [],
        keyClauses: analysis.key_clauses || [],
        recommendations: analysis.recommendations || [],
        processingTimeMs: analysis.processing_time_ms,
        createdAt: analysis.created_at,
      };

      return NextResponse.json({ analysis: formattedAnalysis });
    } catch (error) {
      console.error('Analyze document error:', error);

      await supabaseAdmin
        .from('documents')
        .update({ status: 'failed' })
        .eq('id', id);

      const errorMessage = error instanceof Error ? error.message : '문서 분석에 실패했습니다.';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  });
}
