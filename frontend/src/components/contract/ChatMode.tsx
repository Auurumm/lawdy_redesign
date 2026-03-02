'use client';

import { useState, useRef, useEffect } from 'react';
import { contractTypeNames, type ContractType } from './contractTypes';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatModeProps {
  contractType: ContractType;
  onComplete: (extractedData: Record<string, string>) => void;
  onBack: () => void;
}

export default function ChatMode({ contractType, onComplete, onBack }: ChatModeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 첫 메시지 자동 전송
  useEffect(() => {
    sendInitialMessage();
  }, []);

  const sendInitialMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contract/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType,
          messages: [{ role: 'user', content: `${contractTypeNames[contractType]}를 작성하고 싶습니다. 어떤 정보가 필요한가요?` }],
          currentExtractedData: {},
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '대화 시작에 실패했습니다.');
      }

      setMessages([
        { role: 'assistant', content: data.reply },
      ]);
      if (data.extractedData) setExtractedData(data.extractedData);
      if (data.progress !== undefined) setProgress(data.progress);
    } catch (err) {
      setError(err instanceof Error ? err.message : '대화 시작에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/contract/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType,
          messages: newMessages,
          currentExtractedData: extractedData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '메시지 전송에 실패했습니다.');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);

      if (data.extractedData) {
        setExtractedData(data.extractedData);
      }
      if (data.progress !== undefined) {
        setProgress(data.progress);
      }
      if (data.isComplete) {
        setIsComplete(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.');
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      // Ctrl+Enter → 줄바꿈
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const { selectionStart, selectionEnd } = target;
      setInput(prev => prev.slice(0, selectionStart) + '\n' + prev.slice(selectionEnd));
      // 커서 위치를 줄바꿈 뒤로 이동
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = selectionStart + 1;
      });
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // Enter → 전송
      e.preventDefault();
      sendMessage();
    }
  };

  // textarea 높이 자동 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleComplete = () => {
    onComplete(extractedData);
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* 진행률 바 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">정보 수집 진행률</span>
          <span className="text-xs font-semibold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 메시지 영역 */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {/* 안내 메시지 */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            💬 AI 대화 모드 - {contractTypeNames[contractType]}
          </span>
        </div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-[#f2f3f8] text-gray-900 rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">🤖</span>
                  <span className="text-xs font-semibold text-primary">Lawdy AI</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f2f3f8] px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">🤖</span>
                <span className="text-xs font-semibold text-primary">Lawdy AI</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm">
          {error}
        </div>
      )}

      {/* 수집 완료시 요약 + 확인 */}
      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600 font-semibold text-sm">✅ 정보 수집 완료!</span>
          </div>
          <p className="text-xs text-green-700 mb-3">
            수집된 정보를 바탕으로 계약서를 생성할 수 있습니다.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
            >
              계약서 생성하기 →
            </button>
            <button
              onClick={() => setIsComplete(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              정보 수정하기
            </button>
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="px-3 py-2 border border-[#e1e3ea] rounded-lg text-sm text-gray-500 hover:bg-gray-50 whitespace-nowrap"
        >
          ← 뒤로
        </button>
        <div className="flex-1 flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isComplete ? '추가 정보를 입력하거나 계약서를 생성하세요' : '정보를 입력해주세요... (Enter: 전송, Ctrl+Enter: 줄바꿈)'}
            disabled={isLoading}
            rows={1}
            className="flex-1 px-4 py-2.5 border border-[#e1e3ea] rounded-lg text-sm focus:outline-none focus:border-primary disabled:opacity-50 resize-none overflow-hidden"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
