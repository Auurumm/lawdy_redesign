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
// Word를 PDF로 인쇄한 것처럼: A4 한 장씩 여백(20mm)을 두고, 문단·조항이 페이지 중간에서 잘리지 않게 나눈다.
const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const MARGIN_MM = 20;
const MM_TO_PX = 96 / 25.4;
const PDF_FONT = `'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif`;

export async function downloadContractAsPDF(content: string, title: string): Promise<void> {
  const cleanup: HTMLElement[] = [];
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const baseStyle = `font-family: ${PDF_FONT}; font-size: 12px; line-height: 1.8; color: #000; background: #fff;`;

    // 1) 내용을 블록(제목·문단·목록 한 줄 등) 단위로 만들고, 각 블록의 높이를 잰다
    const source = document.createElement('div');
    source.innerHTML = formatContractToHTML(content, title);

    const measurer = document.createElement('div');
    measurer.style.cssText = `position: fixed; left: -9999px; top: 0; width: ${PAGE_W_MM - MARGIN_MM * 2}mm; ${baseStyle}`;
    document.body.appendChild(measurer);
    cleanup.push(measurer);

    const blocks = Array.from(source.children).map((el) => {
      const wrap = document.createElement('div');
      wrap.style.display = 'flow-root'; // 블록 간 여백이 겹쳐 높이가 어긋나는 것 방지
      wrap.appendChild(el.cloneNode(true));
      return wrap;
    });
    blocks.forEach((b) => measurer.appendChild(b));

    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 100));

    const heights = blocks.map((b) => b.getBoundingClientRect().height);
    const isBlank = (i: number) => !(blocks[i].textContent || '').trim() && !blocks[i].querySelector('hr');
    // 제목류(굵은 글씨 한 줄)는 다음 블록과 함께 두어, 제목만 페이지 끝에 남는 것을 막는다
    const keepWithNext = (i: number) => {
      const el = blocks[i].firstElementChild as HTMLElement | null;
      return !!el && el.style.fontWeight === 'bold' && (el.textContent || '').length < 80;
    };

    // 2) 페이지에 차례로 채우기 (블록은 쪼개지 않음)
    const contentH = (PAGE_H_MM - MARGIN_MM * 2) * MM_TO_PX - 4; // 4px 여유
    const pages: number[][] = [[]];
    let used = 0;
    for (let i = 0; i < blocks.length; i++) {
      const cur = pages[pages.length - 1];
      if (cur.length === 0 && isBlank(i)) continue; // 페이지 맨 위 빈 줄 제거
      const need = heights[i] + (keepWithNext(i) && i + 1 < blocks.length ? heights[i + 1] : 0);
      if (cur.length > 0 && used + need > contentH) {
        pages.push([]);
        used = 0;
        if (isBlank(i)) continue;
      }
      pages[pages.length - 1].push(i);
      used += heights[i];
    }

    // 3) 페이지마다 A4 크기 틀을 만들어 이미지로 찍고 PDF에 한 장씩 넣기
    const pdf = new jsPDF('p', 'mm', 'a4');
    for (let p = 0; p < pages.length; p++) {
      const page = document.createElement('div');
      page.style.cssText = `position: fixed; left: -9999px; top: 0; width: ${PAGE_W_MM}mm; height: ${PAGE_H_MM}mm; padding: ${MARGIN_MM}mm; box-sizing: border-box; overflow: hidden; ${baseStyle}`;
      pages[p].forEach((i) => page.appendChild(blocks[i].cloneNode(true)));

      const num = document.createElement('div');
      num.textContent = `${p + 1} / ${pages.length}`;
      num.style.cssText = `position: absolute; left: 0; right: 0; bottom: 8mm; text-align: center; font-size: 10px; color: #666;`;
      page.appendChild(num);

      document.body.appendChild(page);
      cleanup.push(page);

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      if (p > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, PAGE_W_MM, PAGE_H_MM);
      document.body.removeChild(page);
    }

    pdf.save(`${sanitizeFilename(title)}.pdf`);
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    throw new Error('PDF 다운로드에 실패했습니다. 텍스트 다운로드를 이용해주세요.');
  } finally {
    cleanup.forEach((el) => el.parentNode?.removeChild(el));
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
