'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getMovieById, getEpisodesByMovie, logWatchHistory } from '@/lib/firestore';
import { FaArrowLeft, FaDownload, FaPlay } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function WatchPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEp, setCurrentEp] = useState<any>(null);
  const [season, setSeason] = useState(1);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!id || !user) return;
    async function load() {
      const m = await getMovieById(id);
      setMovie(m);
      if (m?.type === 'series') {
        const eps = await getEpisodesByMovie(id);
        setEpisodes(eps);
        if (eps.length > 0) setCurrentEp(eps[0]);
      }
      setFetching(false);
      if (m) await logWatchHistory(user!.uid, id, m.type || 'movie', m.title);
    }
    load();
  }, [id, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#4285F4] text-4xl font-black animate-pulse">NETMIRROR</div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Content not found.</div>
      </div>
    );
  }

  const rawVideoUrl = movie.type === 'series' ? currentEp?.videoUrl : movie.videoUrl;
  const seasons = [...new Set(episodes.map((e: any) => e.season))].sort();
  const seasonEps = episodes.filter((e: any) => e.season === season);

  // Helper to construct genuine download link for any video (including Google Drive)
  function getDownloadLink(url: string) {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
  }

  const downloadLink = getDownloadLink(rawVideoUrl);

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-[#4285F4] transition-colors bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10"
        >
          <FaArrowLeft />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="text-center px-4">
          <h1 className="text-white font-bold text-base md:text-lg">{movie.title}</h1>
          {currentEp && (
            <p className="text-[#9aa0a6] text-xs">
              S{currentEp.season}:E{currentEp.episode} — {currentEp.title}
            </p>
          )}
        </div>

        {/* Prominent Download Button */}
        {downloadLink ? (
          <a
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-2 bg-[#4285F4] text-white px-4 py-1.5 rounded-full hover:bg-[#3367D6] transition-colors text-sm font-medium shadow-lg"
          >
            <FaDownload size={13} />
            <span>Download</span>
          </a>
        ) : (
          <div className="w-20" />
        )}
      </div>

      {/* Video Player */}
      <div className="relative w-full h-[75vh] md:h-[85vh] bg-black flex items-center justify-center">
        {rawVideoUrl ? (
          rawVideoUrl.includes('drive.google.com') ? (
            <iframe
              src={
                rawVideoUrl.includes('/preview')
                  ? rawVideoUrl
                  : rawVideoUrl.replace(/\/view(\?.*)?$/, '/preview')
              }
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <ReactPlayer
              url={rawVideoUrl}
              playing
              controls
              width="100%"
              height="100%"
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a]">
            <div className="text-[#4285F4] text-6xl mb-6">▶</div>
            <p className="text-white text-xl font-bold mb-2">{movie.title}</p>
            <p className="text-[#9aa0a6]">Video not available yet.</p>
          </div>
        )}
      </div>

      {/* Episodes panel (series only) */}
      {movie.type === 'series' && episodes.length > 0 && (
        <div className="bg-[#202124] px-6 py-6 border-t border-[#3c4043]">
          <h2 className="text-white font-bold text-xl mb-4">Episodes</h2>
          <div className="flex gap-2 mb-4">
            {seasons.map((s: any) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  season === s
                    ? 'bg-[#4285F4] text-white'
                    : 'bg-[#303134] text-[#9aa0a6] hover:bg-[#3c4043]'
                }`}
              >
                Season {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {seasonEps.map((ep: any) => (
              <button
                key={ep.id}
                onClick={() => setCurrentEp(ep)}
                className={`flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                  currentEp?.id === ep.id
                    ? 'bg-[#4285F4]/20 border border-[#4285F4]'
                    : 'bg-[#303134] hover:bg-[#3c4043]'
                }`}
              >
                {ep.thumbnail ? (
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    className="w-20 h-12 object-cover rounded-lg flex-none"
                  />
                ) : (
                  <div className="w-20 h-12 bg-[#202124] rounded-lg flex-none flex items-center justify-center">
                    <FaPlay className="text-[#9aa0a6]" size={12} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">
                    E{ep.episode}: {ep.title}
                  </p>
                  <p className="text-[#9aa0a6] text-xs mt-1 line-clamp-2">{ep.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Movie Details & Download Section */}
      <div className="bg-[#202124] px-6 py-8 border-t border-[#3c4043]">
        <div className="max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-white font-bold text-3xl mb-2">{movie.title}</h2>
            <div className="flex items-center flex-wrap gap-3 mb-4 text-sm text-[#9aa0a6]">
              {movie.rating && <span className="text-green-400 font-bold">{movie.rating}</span>}
              {movie.year && <span>{movie.year}</span>}
              {movie.genre && (
                <span className="bg-[#303134] px-3 py-1 rounded-full text-xs font-medium text-white border border-[#3c4043]">
                  {movie.genre}
                </span>
              )}
              {movie.duration && <span>{movie.duration}</span>}
            </div>
            {movie.description && (
              <p className="text-[#e8eaed] leading-relaxed text-sm max-w-2xl">{movie.description}</p>
            )}
          </div>

          {/* Direct Download Callout Card */}
          {downloadLink && (
            <div className="bg-[#303134] p-5 rounded-2xl border border-[#3c4043] flex-none flex flex-col items-center text-center max-w-xs shadow-xl">
              <div className="w-12 h-12 rounded-full bg-[#4285F4]/20 text-[#4285F4] flex items-center justify-center mb-3">
                <FaDownload size={20} />
              </div>
              <h3 className="text-white font-semibold text-base mb-1">Download Movie</h3>
              <p className="text-[#9aa0a6] text-xs mb-4">Watch offline anytime on your device</p>
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full bg-[#4285F4] text-white py-2.5 rounded-xl font-medium hover:bg-[#3367D6] transition-colors text-sm flex items-center justify-center gap-2"
              >
                <FaDownload size={14} /> Download Now
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
