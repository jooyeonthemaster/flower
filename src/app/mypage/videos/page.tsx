'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Video } from '@/types/firestore';

export default function VideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/videos?userId=${user.uid}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error('영상 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModeLabel = (mode: string) => {
    return mode === 'composition' ? 'Premium' : 'Standard';
  };

  const getModeColor = (mode: string) => {
    return mode === 'composition' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">내 영상</h1>
        <p className="text-gray-500 mt-1">생성한 홀로그램 영상을 확인하고 다운로드하세요.</p>
      </div>

      {/* Videos Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-gray-500">
              총 <span className="font-bold text-gray-900">{videos.length}</span>개의 영상
            </p>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">로딩 중...</div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Video Thumbnail */}
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    {video.videoUrl ? (
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseOut={(e) => {
                          const vid = e.target as HTMLVideoElement;
                          vid.pause();
                          vid.currentTime = 0;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Mode Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(video.mode)}`}>
                        {getModeLabel(video.mode)}
                      </span>
                    </div>
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <p className="font-medium text-gray-900 truncate">{video.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-500">
                        {new Date(video.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                      <p className="text-sm text-gray-500">{video.duration}초</p>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <a
                        href={video.videoUrl}
                        download={`${video.title}.mp4`}
                        className="flex-1 py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
                      >
                        다운로드
                      </a>
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="py-2 px-4 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        미리보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 mb-4">아직 생성된 영상이 없습니다.</p>
              <a
                href="/ai-hologram"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                영상 만들러 가기
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-black rounded-2xl overflow-hidden">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-white font-medium">{selectedVideo.title}</p>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(selectedVideo.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
