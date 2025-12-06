'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserOrders } from '@/lib/firestore';
import {
  PRODUCT_COLOR_LABELS,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_ICONS,
  formatDate,
} from '@/types/order';

interface VideoItem {
  orderId: string;
  videoUrl: string;
  imageUrl: string;
  thumbnailUrl?: string;
  productColor: 'blue' | 'red';
  category: string;
  createdAt: Date;
}

export default function VideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    if (user) {
      loadVideos();
    }
  }, [user]);

  const loadVideos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { orders } = await getUserOrders(user.uid, 100);

      // 영상이 있는 주문만 필터링하여 VideoItem으로 변환
      const videoItems: VideoItem[] = orders
        .filter((order) => order.generatedMedia?.videoUrl)
        .map((order) => ({
          orderId: order.orderId,
          videoUrl: order.generatedMedia.videoUrl,
          imageUrl: order.generatedMedia.imageUrl,
          thumbnailUrl: order.generatedMedia.thumbnailUrl,
          productColor: order.productInfo.color,
          category: order.designInfo.category,
          createdAt: order.createdAt,
        }));

      setVideos(videoItems);
    } catch (error) {
      console.error('영상 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (video: VideoItem) => {
    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hologram-${video.orderId}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('다운로드 실패:', err);
      alert('영상 다운로드에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">내 영상</h1>
        <p className="text-gray-600 mt-1">총 {videos.length}개의 홀로그램 영상</p>
      </div>

      {/* 영상 갤러리 */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">아직 생성된 영상이 없습니다.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            홀로그램 주문하기
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.orderId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* 썸네일/비디오 영역 */}
              <div
                className="relative aspect-video bg-gray-900 cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                {video.thumbnailUrl || video.imageUrl ? (
                  <img
                    src={video.thumbnailUrl || video.imageUrl}
                    alt="영상 썸네일"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}

                {/* 재생 버튼 오버레이 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* 색상 배지 */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    video.productColor === 'blue' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {video.productColor === 'blue' ? '💙' : '❤️'} {PRODUCT_COLOR_LABELS[video.productColor]}
                  </span>
                </div>
              </div>

              {/* 정보 영역 */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {EVENT_CATEGORY_ICONS[video.category as keyof typeof EVENT_CATEGORY_ICONS]} {EVENT_CATEGORY_LABELS[video.category as keyof typeof EVENT_CATEGORY_LABELS]}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(video.createdAt)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    재생
                  </button>
                  <button
                    onClick={() => handleDownload(video)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    다운로드
                  </button>
                  <Link
                    href={`/mypage/orders/${video.orderId}`}
                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    title="주문 상세"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 비디오 모달 */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 비디오 플레이어 */}
            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              className="w-full aspect-video"
            />

            {/* 하단 정보 및 액션 */}
            <div className="p-4 bg-gray-900 flex items-center justify-between">
              <div className="text-white">
                <p className="font-medium">
                  {EVENT_CATEGORY_ICONS[selectedVideo.category as keyof typeof EVENT_CATEGORY_ICONS]} {EVENT_CATEGORY_LABELS[selectedVideo.category as keyof typeof EVENT_CATEGORY_LABELS]}
                </p>
                <p className="text-sm text-gray-400">주문번호: {selectedVideo.orderId}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(selectedVideo)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  다운로드
                </button>
                <Link
                  href={`/mypage/orders/${selectedVideo.orderId}`}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  주문 상세
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
