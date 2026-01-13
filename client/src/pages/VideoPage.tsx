import React from 'react';
import VideoFeed from '../components/VideoFeed';

export default function VideoPage() {
  return (
    <div className="pb-20 bg-black min-h-screen">
       {/* Header Khusus Video */}
       <div className="sticky top-0 z-50 bg-transparent p-4 flex justify-between items-center text-white bg-gradient-to-b from-black/80 to-transparent">
          <h1 className="font-bold text-lg drop-shadow-md">Shopee Video</h1>
          <div className="flex gap-4 text-sm font-semibold">
              <span className="opacity-60">Mengikuti</span>
              <span className="border-b-2 border-white pb-1">Untuk Anda</span>
          </div>
          <button className="text-xl">🔍</button>
       </div>

       {/* Isi Video (Menggunakan Komponen yang sudah ada) */}
       <div className="max-w-md mx-auto">
          <VideoFeed />
       </div>
    </div>
  );
}