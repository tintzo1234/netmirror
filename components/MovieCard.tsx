'use client';
import Link from 'next/link';
import { FaPlay, FaPlus, FaDownload, FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';

interface MovieCardProps {
  id: string;
  title: string;
  thumbnail: string;
  genre?: string;
  year?: number;
  rating?: string;
  type?: string;
  downloadable?: boolean;
  videoUrl?: string;
}

export default function MovieCard({
  id,
  title,
  thumbnail,
  genre,
  year,
  rating,
  type,
  downloadable,
  videoUrl,
}: MovieCardProps) {
  const [hovered, setHovered] = useState(false);

  function getDownloadLink(url?: string) {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
  }

  const downloadLink = getDownloadLink(videoUrl);

  return (
    <div
      className="relative cursor-pointer rounded-2xl overflow-hidden card-hover group bg-[#303134] border border-[#3c4043]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full aspect-video bg-[#202124]">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#202124]">
            <span className="text-[#4285F4] text-4xl font-bold">{title.charAt(0)}</span>
          </div>
        )}
        {type === 'series' && (
          <span className="absolute top-2 left-2 bg-[#4285F4] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Series
          </span>
        )}
      </div>

      {hovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent flex flex-col justify-end p-3.5">
          <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-2 text-xs text-[#9aa0a6] mb-2.5">
            {rating && <span className="text-green-400 font-bold">{rating}</span>}
            {year && <span>{year}</span>}
            {genre && <span>{genre}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/watch/${id}`}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-gray-200 transition-colors shadow"
            >
              <FaPlay className="text-black ml-0.5" size={11} />
            </Link>

            {downloadLink && (
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                download
                title="Download Movie"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white transition-colors shadow"
              >
                <FaDownload size={11} />
              </a>
            )}

            <Link
              href={`/watch/${id}`}
              className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-[#303134] border border-[#3c4043] hover:border-white text-white transition-colors"
            >
              <FaInfoCircle size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
