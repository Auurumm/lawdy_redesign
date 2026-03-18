import type { Paragraph } from 'docx';

/**
 * 계약서 다운로드 유틸리티
 * - PDF: html2canvas + jsPDF (한글 완벽 지원)
 * - Word: docx 라이브러리
 * - Text: 기본 Blob (마크다운 구문 제거)
 */

// ── 마크다운 인라인 → HTML 변환 ──
function inlineMarkdownToHTML(text: string): string {
  let html = escapeHtml(text);
  // **bold** → <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // [수정], [추가] 등 대괄호 태그 하이라이트
  html = html.replace(
    /\[(수정|추가|삭제|변경|신설|보완)\]/g,
    '<span style="background:#fef3c7;color:#92400e;padding:1px 5px;border-radius:3px;font-weight:600;font-size:11px;">[$1]</span>'
  );
  return html;
}

// ── 마크다운 인라인 → TextRun[] 변환 (Word용) ──
interface TextRunConfig {
  text: string;
  bold?: boolean;
  size: number;
  color?: string;
  highlight?: string;
}

function parseInlineMarkdown(text: string, baseSize: number): TextRunConfig[] {
  const runs: TextRunConfig[] = [];
  // **bold** 와 [태그] 를 순서대로 파싱
  const regex = /(\*\*(.+?)\*\*|\[(수정|추가|삭제|변경|신설|보완)\])/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 매치 앞 일반 텍스트
    if (match.index > lastIndex) {
      runs.push({ text: text.slice(lastIndex, match.index), size: baseSize });
    }

    if (match[2]) {
      // **bold**
      runs.push({ text: match[2], bold: true, size: baseSize });
    } else if (match[3]) {
      // [수정] 등 태그
      runs.push({ text: `[${match[3]}]`, bold: true, size: baseSize - 2, color: '92400E' });
    }

    lastIndex = regex.lastIndex;
  }

  // 나머지 텍스트
  if (lastIndex < text.length) {
    runs.push({ text: text.slice(lastIndex), size: baseSize });
  }

  if (runs.length === 0) {
    runs.push({ text, size: baseSize });
  }

  return runs;
}

// ── 마크다운 구문 제거 (텍스트 다운로드용) ──
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,3}\s+/gm, '')      // # 제목 → 제목
    .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** → bold
    .replace(/^[-*]\s+/gm, '• ')       // - item → • item
    .replace(/^>\s+/gm, '  ')          // > 인용 → 들여쓰기
    .replace(/---+/g, '────────────'); // --- → 구분선
}

// ── PDF 다운로드 (한글 지원) ──
export async function downloadContractAsPDF(content: string, title: string): Promise<void> {
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 210mm;
      padding: 20mm;
      background: white;
      font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      line-height: 1.8;
      color: #000;
    `;

    const formattedContent = formatContractToHTML(content, title);
    container.innerHTML = formattedContent;
    document.body.appendChild(container);

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const scale = canvas.width / pdfWidth;
    const pageCanvasHeight = Math.floor(pdfHeight * scale);
    const canvasCtx = canvas.getContext('2d')!;

    // 특정 y 좌표의 행이 흰색(빈 줄)인지 확인
    const isWhiteRow = (y: number): boolean => {
      const rowData = canvasCtx.getImageData(0, y, canvas.width, 1).data;
      for (let i = 0; i < rowData.length; i += 4) {
        if (rowData[i] < 250 || rowData[i + 1] < 250 || rowData[i + 2] < 250) {
          return false;
        }
      }
      return true;
    };

    // 페이지 경계 근처에서 텍스트가 없는 빈 줄을 찾아 그 위치에서 자르기
    const findSafeBreak = (targetY: number): number => {
      const searchRange = Math.floor(80 * scale); // ~80mm 범위에서 탐색
      for (let y = targetY; y > targetY - searchRange && y > 0; y--) {
        if (isWhiteRow(y)) return y;
      }
      return targetY;
    };

    // 페이지별 슬라이스 위치 계산
    const breaks: number[] = [0];
    let currentY = 0;
    while (currentY + pageCanvasHeight < canvas.height) {
      const rawBreak = currentY + pageCanvasHeight;
      const safeBreak = findSafeBreak(rawBreak);
      breaks.push(safeBreak);
      currentY = safeBreak;
    }

    for (let i = 0; i < breaks.length; i++) {
      if (i > 0) pdf.addPage();

      const srcY = breaks[i];
      const srcEnd = i + 1 < breaks.length ? breaks[i + 1] : canvas.height;
      const srcH = srcEnd - srcY;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = srcH;
      const ctx = pageCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

      const pageImgData = pageCanvas.toDataURL('image/png');
      const pageImgHeight = srcH / scale;
      pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageImgHeight);
    }

    document.body.removeChild(container);
    pdf.save(`${sanitizeFilename(title)}.pdf`);
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    throw new Error('PDF 다운로드에 실패했습니다. 텍스트 다운로드를 이용해주세요.');
  }
}

// ── 계약서 내용을 HTML로 포맷팅 (마크다운 지원) ──
function formatContractToHTML(content: string, title: string): string {
  const lines = content.split('\n');
  let html = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 22px; font-weight: bold; margin: 0;">${escapeHtml(title)}</h1>
      <div style="width: 100%; height: 2px; background: #333; margin-top: 15px;"></div>
    </div>
  `;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      html += '<div style="height: 12px;"></div>';
      continue;
    }

    // --- 구분선
    if (/^-{3,}$/.test(trimmedLine)) {
      html += '<hr style="border: none; border-top: 1px solid #ccc; margin: 16px 0;" />';
      continue;
    }

    // ### 소제목
    if (/^###\s+/.test(trimmedLine)) {
      const text = trimmedLine.replace(/^###\s+/, '');
      html += `<div style="font-weight: bold; font-size: 13px; margin-top: 14px; margin-bottom: 6px;">${inlineMarkdownToHTML(text)}</div>`;
      continue;
    }

    // ## 중제목
    if (/^##\s+/.test(trimmedLine)) {
      const text = trimmedLine.replace(/^##\s+/, '');
      html += `<div style="font-weight: bold; font-size: 15px; margin-top: 20px; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb;">${inlineMarkdownToHTML(text)}</div>`;
      continue;
    }

    // # 대제목
    if (/^#\s+/.test(trimmedLine)) {
      const text = trimmedLine.replace(/^#\s+/, '');
      html += `<div style="font-weight: bold; font-size: 17px; margin-top: 24px; margin-bottom: 12px;">${inlineMarkdownToHTML(text)}</div>`;
      continue;
    }

    // > 인용문
    if (/^>\s+/.test(trimmedLine)) {
      const text = trimmedLine.replace(/^>\s+/, '');
      html += `<div style="padding-left: 16px; border-left: 3px solid #d1d5db; color: #6b7280; margin-bottom: 6px;">${inlineMarkdownToHTML(text)}</div>`;
      continue;
    }

    // - 또는 * 리스트
    if (/^[-*]\s+/.test(trimmedLine)) {
      const text = trimmedLine.replace(/^[-*]\s+/, '');
      html += `<div style="padding-left: 20px; margin-bottom: 4px;">• ${inlineMarkdownToHTML(text)}</div>`;
      continue;
    }

    // 제X조 스타일
    if (/^제\d+조/.test(trimmedLine)) {
      html += `<div style="font-weight: bold; font-size: 14px; margin-top: 20px; margin-bottom: 10px;">${inlineMarkdownToHTML(trimmedLine)}</div>`;
      continue;
    }

    // 숫자 리스트 (①②③ 또는 1. 2. 3.)
    if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine)) {
      html += `<div style="padding-left: 20px; margin-bottom: 6px;">${inlineMarkdownToHTML(trimmedLine)}</div>`;
      continue;
    }

    // 일반 텍스트
    html += `<div style="margin-bottom: 6px;">${inlineMarkdownToHTML(trimmedLine)}</div>`;
  }

  html += `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center;">
      <p style="font-size: 10px; color: #666;">Generated by Lawdy AI</p>
      <p style="font-size: 10px; color: #666;">${new Date().toLocaleDateString('ko-KR')}</p>
    </div>
  `;

  return html;
}

// ── Word 다운로드 (docx, 마크다운 지원) ──
export async function downloadContractAsWord(content: string, title: string): Promise<void> {
  try {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');

    const lines = content.split('\n');
    const children: Paragraph[] = [];

    // 제목
    children.push(
      new Paragraph({
        children: [new TextRun({ text: title, bold: true, size: 36 })],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 12, color: '333333' },
        },
      })
    );

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        children.push(new Paragraph({ children: [], spacing: { after: 100 } }));
        continue;
      }

      // --- 구분선
      if (/^-{3,}$/.test(trimmedLine)) {
        children.push(
          new Paragraph({
            children: [],
            spacing: { before: 100, after: 100 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } },
          })
        );
        continue;
      }

      // ### 소제목
      if (/^###\s+/.test(trimmedLine)) {
        const text = trimmedLine.replace(/^###\s+/, '');
        const runs = parseInlineMarkdown(text, 24);
        children.push(
          new Paragraph({
            children: runs.map(r => new TextRun({ text: r.text, bold: true, size: r.size, color: r.color })),
            spacing: { before: 200, after: 100 },
          })
        );
        continue;
      }

      // ## 중제목
      if (/^##\s+/.test(trimmedLine)) {
        const text = trimmedLine.replace(/^##\s+/, '');
        const runs = parseInlineMarkdown(text, 28);
        children.push(
          new Paragraph({
            children: runs.map(r => new TextRun({ text: r.text, bold: true, size: r.size, color: r.color })),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          })
        );
        continue;
      }

      // # 대제목
      if (/^#\s+/.test(trimmedLine)) {
        const text = trimmedLine.replace(/^#\s+/, '');
        const runs = parseInlineMarkdown(text, 32);
        children.push(
          new Paragraph({
            children: runs.map(r => new TextRun({ text: r.text, bold: true, size: r.size, color: r.color })),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          })
        );
        continue;
      }

      // > 인용문
      if (/^>\s+/.test(trimmedLine)) {
        const text = trimmedLine.replace(/^>\s+/, '');
        const runs = parseInlineMarkdown(text, 22);
        children.push(
          new Paragraph({
            children: runs.map(r => new TextRun({ text: r.text, bold: r.bold, size: r.size, color: r.color || '6B7280', italics: true })),
            indent: { left: 400 },
            spacing: { after: 80 },
            border: { left: { style: BorderStyle.SINGLE, size: 6, color: 'D1D5DB' } },
          })
        );
        continue;
      }

      // - 또는 * 리스트
      if (/^[-*]\s+/.test(trimmedLine)) {
        const text = trimmedLine.replace(/^[-*]\s+/, '');
        const runs = parseInlineMarkdown(text, 22);
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: '• ', size: 22 }),
              ...runs.map(r => new TextRun({ text: r.text, bold: r.bold, size: r.size, color: r.color })),
            ],
            indent: { left: 400 },
            spacing: { after: 60 },
          })
        );
        continue;
      }

      // 제X조 스타일
      if (/^제\d+조/.test(trimmedLine)) {
        const runs = parseInlineMarkdown(trimmedLine, 26);
        children.push(
          new Paragraph({
            children: runs.map(r => new TextRun({ text: r.text, bold: true, size: r.size, color: r.color })),
            spacing: { before: 300, after: 150 },
          })
        );
        continue;
      }

      // 숫자 리스트
      if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine)) {
        const runs = parseInlineMarkdown(trimmedLine, 22);
        children.push(
          new Paragraph({
            children: runs.map(r => new TextRun({ text: r.text, bold: r.bold, size: r.size, color: r.color })),
            indent: { left: 400 },
            spacing: { after: 80 },
          })
        );
        continue;
      }

      // 일반 텍스트
      const runs = parseInlineMarkdown(trimmedLine, 22);
      children.push(
        new Paragraph({
          children: runs.map(r => new TextRun({ text: r.text, bold: r.bold, size: r.size, color: r.color })),
          spacing: { after: 80 },
        })
      );
    }

    // 하단 정보
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Generated by Lawdy AI - ${new Date().toLocaleDateString('ko-KR')}`, size: 18, color: '666666' }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 },
      })
    );

    const doc = new Document({
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizeFilename(title)}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Word 생성 오류:', error);
    throw new Error('Word 다운로드에 실패했습니다.');
  }
}

// ── 텍스트 다운로드 (마크다운 구문 제거) ──
export function downloadContractAsText(content: string, title: string): void {
  const cleanContent = `${title}\n${'='.repeat(title.length)}\n\n${stripMarkdown(content)}`;
  const blob = new Blob([cleanContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(title)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── 유틸리티 ──
function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
