'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { AIDesignData } from '../hooks/useProductWizard'

interface AIDesignStepProps {
  initialData: AIDesignData
  onSubmit: (data: AIDesignData) => void
}

const categories = [
  { id: 'opening', label: '🎉 개업 축하', desc: '대박 기원' },
  { id: 'wedding', label: '💍 결혼식', desc: '행복한 출발' },
  { id: 'birthday', label: '🎂 생일', desc: '즐거운 파티' },
  { id: 'memorial', label: '🕊️ 추모', desc: '깊은 애도' },
  { id: 'event', label: '🎤 행사/전시', desc: '성공적 개최' },
  { id: 'promotion', label: '📢 승진/영전', desc: '축하와 응원' },
]

const styles = [
  { id: 'neon', label: '네온 사이버펑크', desc: '강렬한 빛, 미래도시', color: 'from-blue-600 to-purple-600' },
  { id: 'elegant', label: '우아한 플로럴', desc: '부드러운 꽃, 금빛', color: 'from-pink-400 to-rose-400' },
  { id: 'luxury', label: '럭셔리 골드', desc: '고급스러운 금색 광택', color: 'from-yellow-500 to-amber-600' },
  { id: 'minimal', label: '모던 미니멀', desc: '심플한 라인, 현대적', color: 'from-gray-400 to-slate-500' },
  { id: 'traditional', label: '한국 전통', desc: '단청, 전통 문양', color: 'from-red-500 to-blue-500' },
  { id: 'nature', label: '내추럴 포레스트', desc: '숲, 나뭇잎, 힐링', color: 'from-green-500 to-emerald-600' },
  { id: 'fantasy', label: '신비로운 판타지', desc: '몽환적 입자, 마법', color: 'from-indigo-400 to-cyan-400' },
  { id: 'ice', label: '크리스탈 아이스', desc: '투명한 얼음, 차가움', color: 'from-sky-300 to-blue-400' },
  { id: 'fire', label: '블레이징 파이어', desc: '타오르는 불꽃, 열정', color: 'from-orange-500 to-red-600' },
  { id: 'artdeco', label: '아트 데코', desc: '화려한 기하학 패턴', color: 'from-yellow-200 to-yellow-600' },
  { id: 'space', label: '갤럭시 스페이스', desc: '우주, 별, 은하수', color: 'from-violet-600 to-fuchsia-600' },
  { id: 'sketch', label: '아티스틱 스케치', desc: '빛으로 그린 드로잉', color: 'from-gray-300 to-gray-500' },
]

export default function AIDesignStep({ initialData, onSubmit }: AIDesignStepProps) {
  const [category, setCategory] = useState(initialData.category || 'opening')
  const [style, setStyle] = useState(initialData.style || 'neon')
  const [prompt, setPrompt] = useState(initialData.prompt || '')
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.referenceImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // initialData가 변경되면 상태 업데이트
  useEffect(() => {
    setCategory(initialData.category || 'opening')
    setStyle(initialData.style || 'neon')
    setPrompt(initialData.prompt || '')
    setPreviewUrl(initialData.referenceImage || null)
  }, [initialData])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!prompt.trim()) return
    onSubmit({ prompt, category, style, referenceImage: previewUrl || undefined })
  }

  const isValid = prompt.trim().length > 0

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Controls (5/12 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow-lg">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI 홀로그램 디자인</h2>
              <p className="text-gray-600">원하는 스타일을 선택하고 내용을 입력하세요.</p>
            </div>

            {/* Category Grid */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-semibold text-gray-700">행사 유형</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      category === cat.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-sm">{cat.label}</div>
                    <div className="text-xs opacity-70">{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-semibold text-gray-700">요청 사항</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 화려한 금색 리본, 반짝이는 효과, 000님 대박나세요"
                className="w-full h-28 bg-white border-2 border-gray-200 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none text-sm transition-all"
              />
              {!isValid && prompt.length === 0 && (
                <p className="text-xs text-amber-600">* 요청 사항을 입력해주세요</p>
              )}
            </div>

            {/* Reference Image */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">로고/이미지 첨부 (선택)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all relative overflow-hidden bg-gray-50"
              >
                {previewUrl ? (
                  <>
                    <div className="absolute inset-0 p-4 flex items-center justify-center">
                      <Image src={previewUrl} alt="Reference" fill className="object-contain p-4" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-white/90 py-2 text-center text-xs text-blue-600 font-medium backdrop-blur-sm border-t border-gray-200">
                      클릭하여 이미지 변경
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm font-medium">클릭하여 업로드</p>
                    <p className="text-xs text-gray-400 mt-1">로고나 원하는 이미지를 첨부하세요</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Button - Mobile */}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`lg:hidden w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
              isValid
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:-translate-y-1'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            AI 생성 시작하기 →
          </button>
        </div>

        {/* Right Column: Visual Style Selector (7/12 columns) */}
        <div className="lg:col-span-7">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow-lg h-full">
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700">디자인 스타일 선택</label>
              <p className="text-xs text-gray-500 mt-1">홀로그램의 시각적 스타일을 선택하세요</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden transition-all duration-300 ${
                    style === s.id
                      ? 'ring-4 ring-blue-500 scale-[1.02] z-10 shadow-xl'
                      : 'hover:scale-[1.02] hover:ring-2 hover:ring-gray-300 opacity-80 hover:opacity-100 shadow-md'
                  }`}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color}`}></div>

                  {/* Overlay Content */}
                  <div className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                    <div className="font-bold text-white text-sm leading-tight mb-0.5 drop-shadow-md">
                      {s.label}
                    </div>
                    <div className="text-xs text-gray-200 line-clamp-1 font-light">
                      {s.desc}
                    </div>

                    {/* Selected Checkmark */}
                    {style === s.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Submit Button - Desktop */}
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`hidden lg:block w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                isValid
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:-translate-y-1'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              AI 생성 시작하기 →
            </button>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
