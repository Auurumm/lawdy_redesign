import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { count: totalAnalyses } = await supabaseAdmin
      .from('analyses')
      .select('*', { count: 'exact', head: true });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthlyAnalyses } = await supabaseAdmin
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    const { data: analysisData } = await supabaseAdmin
      .from('analyses')
      .select('risk_level, processing_time_ms');

    let avgRiskLevel: 'low' | 'medium' | 'high' | null = null;
    let avgAnalysisTime = 0;

    if (analysisData && analysisData.length > 0) {
      const riskScores: number[] = analysisData.map((r) => {
        if (r.risk_level === 'low') return 1;
        if (r.risk_level === 'medium') return 2;
        if (r.risk_level === 'high') return 3;
        return 0;
      });
      const avgScore =
        riskScores.reduce((a: number, b: number) => a + b, 0) / riskScores.length;
      if (avgScore < 1.5) avgRiskLevel = 'low';
      else if (avgScore < 2.5) avgRiskLevel = 'medium';
      else avgRiskLevel = 'high';

      const validTimes = analysisData
        .filter((r) => r.processing_time_ms != null)
        .map((r) => r.processing_time_ms as number);
      if (validTimes.length > 0) {
        const totalMs = validTimes.reduce((a, b) => a + b, 0);
        avgAnalysisTime = Math.round((totalMs / validTimes.length / 1000) * 10) / 10;
      }
    }

    return NextResponse.json({
      totalAnalyses: totalAnalyses || 0,
      monthlyAnalyses: monthlyAnalyses || 0,
      avgRiskLevel,
      avgAnalysisTime,
    });
  } catch (error) {
    console.error('Get public statistics error:', error);
    return NextResponse.json(
      { error: '통계를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
