import Link from 'next/link';

interface ResultStepProps {
  videoUrl: string;
  onReset: () => void;
}

export default function ResultStep({ videoUrl, onReset }: ResultStepProps) {
  const handleSendToAdmin = () => {
    alert('관리자에게 영상이 전송되었습니다. 확인 후 연락드리겠습니다.');
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            렌더링 완료
          </div>
          <h2 className="text-2xl font-bold text-white">나만의 홀로그램 완성</h2>
        </div>
        <div className="flex space-x-3">
          <Link href="/" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm">
            메인으로
          </Link>
        </div>
      </div>

      {/* Main Video Area - Fills remaining height */}
      <div className="flex-1 relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
        <video 
          src={videoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline
          controls
          className="w-full h-full object-contain"
        />
        
        {/* Overlay info on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <p className="text-white/80 text-sm">Veo 3.1 Generated • 16:9 Cinematic Ratio</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={handleSendToAdmin}
          className="py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          관리자에게 전송
        </button>

        <a
          href={videoUrl}
          download="my-hologram.mp4"
          className="py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          영상 다운로드
        </a>
        
        <button
          onClick={onReset}
          className="py-4 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-all"
        >
          다시 만들기
        </button>
      </div>
    </div>
  );
}
