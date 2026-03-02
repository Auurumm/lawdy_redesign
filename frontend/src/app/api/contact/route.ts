import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const INQUIRY_TYPE_MAP: Record<string, string> = {
  '일반 문의': 'general',
  '기술 문제': 'technical',
  '결제 관련': 'payment',
  '기타': 'other',
};

const SUPPORT_LEVEL_MAP: Record<string, string> = {
  '낮음': 'low',
  '중간': 'normal',
  '높음': 'high',
  '긴급': 'urgent',
};

export async function POST(request: NextRequest) {
  try {
    const { type, name, email, inquiryType, message, priorityLevel, problemDescription } = await request.json();

    if (type === 'contact') {
      if (!name || !email || !message) {
        return NextResponse.json(
          { error: '이름, 이메일, 메시지를 모두 입력해주세요.' },
          { status: 400 }
        );
      }

      const dbInquiryType = INQUIRY_TYPE_MAP[inquiryType] || 'general';

      const { error } = await supabaseAdmin
        .from('inquiries')
        .insert({
          name,
          email,
          inquiry_type: dbInquiryType,
          content: message,
          status: 'received',
        });

      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json(
          { error: '문의 등록에 실패했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: '문의가 성공적으로 접수되었습니다.' });
    }

    if (type === 'support') {
      if (!email || !problemDescription) {
        return NextResponse.json(
          { error: '이메일과 문제 설명을 모두 입력해주세요.' },
          { status: 400 }
        );
      }

      const dbSupportLevel = SUPPORT_LEVEL_MAP[priorityLevel] || 'normal';

      const { error } = await supabaseAdmin
        .from('support_requests')
        .insert({
          user_email: email,
          support_level: dbSupportLevel,
          problem_summary: problemDescription.substring(0, 255),
          problem_detail: problemDescription,
          status: 'received',
        });

      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json(
          { error: '지원 요청 등록에 실패했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: '지원 요청이 성공적으로 접수되었습니다.' });
    }

    return NextResponse.json(
      { error: '잘못된 요청입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
