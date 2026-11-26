'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { addMovie } from '@/lib/firestore';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FaArrowLeft, FaLink, FaImage, FaFilm, FaUpload } from 'react-icons/fa';
import AdminGuard from '@/components/AdminGuard';

export default function AddMoviePage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    year: '',
    rating: '',
    duration: '',
    type: 'movie',
    downloadable: false,
  });

  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>('upload');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user && !userData) return null;

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  // Handle local image file upload directly as Base64 (zero server setup, instant preview)
  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be under 2MB for fast loading');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
        setThumbnailUrl(result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) {
      toast.error('Title is required');
      return;
    }
    if (!videoUrl.trim()) {
      toast.error('Please enter a Video Link (YouTube, Drive, or MP4 link)');
      return;
    }

    setLoading(true);
    try {
      const finalThumb =
        thumbnailUrl.trim() ||
        thumbnailPreview ||
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80';

      await addMovie({
        ...form,
        year: form.year ? parseInt(form.year) : null,
        thumbnail: finalThumb,
        videoUrl: videoUrl.trim(),
      });

      toast.success('Movie/Series added successfully!');
      router.push('/admin');
    } catch (err: any) {
      console.error('Add Movie Error:', err);
      toast.error(err.message || 'Failed to add content');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminGuard requiredPassword="admin@3433" storageKey="netmirror_admin_auth" title="Admin Portal Lock">
      <div className="min-h-screen bg-[#202124]">
        <Navbar />
        <div className="pt-24 px-4 md:px-8 max-w-3xl mx-auto pb-16">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="p-2.5 rounded-full hover:bg-[#303134] text-[#9aa0a6] hover:text-white transition-colors"
            >
              <FaArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-white text-2xl font-bold">Add New Content</h1>
              <p className="text-[#9aa0a6] text-sm">Add movies or TV shows with thumbnail & video</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-[#303134] border border-[#3c4043] rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <FaFilm className="text-[#4285F4]" /> Movie Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#9aa0a6] text-xs font-medium mb-1.5 block">Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Inception, Stranger Things"
                    className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555] text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#9aa0a6] text-xs font-medium mb-1.5 block">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] text-sm"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">TV Series</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#9aa0a6] text-xs font-medium mb-1.5 block">Genre</label>
                  <input
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    placeholder="Action, Sci-Fi, Drama..."
                    className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555] text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#9aa0a6] text-xs font-medium mb-1.5 block">Year</label>
                  <input
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    type="number"
                    placeholder="2024"
                    className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555] text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#9aa0a6] text-xs font-medium mb-1.5 block">Rating</label>
                  <input
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="PG-13, 8.5/10, U/A"
                    className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555] text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#9aa0a6] text-xs font-medium mb-1.5 block">Duration</label>
                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="2h 15m or 1 Season"
                    className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#9aa0a6] text-xs font-medium mb-1.5 block">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Movie plot or summary..."
                  className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555] resize-none text-sm"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="downloadable"
                  checked={form.downloadable}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#4285F4] rounded"
                />
                <span className="text-[#e8eaed] text-sm">
                  Allow users to download this video
                </span>
              </label>
            </div>

            {/* Media Upload & Links */}
            <div className="bg-[#303134] border border-[#3c4043] rounded-2xl p-6 space-y-5 shadow-xl">
              <div>
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <FaLink className="text-[#34A853]" /> Video & Thumbnail Setup
                </h2>
                <p className="text-[#9aa0a6] text-xs mt-1">
                  Upload thumbnail directly from device or paste an image link.
                </p>
              </div>

              {/* Video URL */}
              <div>
                <label className="text-[#9aa0a6] text-xs font-medium mb-1.5 block">
                  1. Video Stream Link * (YouTube / Google Drive / Direct MP4)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  placeholder="e.g. https://drive.google.com/file/d/... or YouTube link"
                  className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555] text-sm"
                />
              </div>

              {/* Thumbnail Selector */}
              <div>
                <label className="text-[#9aa0a6] text-xs font-medium mb-2 block flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FaImage /> 2. Poster / Thumbnail Image</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setThumbnailMode('upload')}
                      className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                        thumbnailMode === 'upload'
                          ? 'bg-[#4285F4] text-white'
                          : 'bg-[#202124] text-[#9aa0a6] hover:text-white'
                      }`}
                    >
                      📁 Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailMode('url')}
                      className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                        thumbnailMode === 'url'
                          ? 'bg-[#4285F4] text-white'
                          : 'bg-[#202124] text-[#9aa0a6] hover:text-white'
                      }`}
                    >
                      🔗 Paste Link
                    </button>
                  </div>
                </label>

                {thumbnailMode === 'upload' ? (
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#3c4043] hover:border-[#4285F4] rounded-xl p-6 cursor-pointer bg-[#202124] transition-colors">
                      <FaUpload className="text-[#9aa0a6] text-2xl mb-2" />
                      <span className="text-sm text-white font-medium">Click to choose image from device</span>
                      <span className="text-xs text-[#9aa0a6] mt-1">PNG, JPG, WebP supported</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => {
                      setThumbnailUrl(e.target.value);
                      setThumbnailPreview(e.target.value);
                    }}
                    placeholder="https://image.tmdb.org/... or any direct image URL"
                    className="w-full bg-[#202124] border border-[#3c4043] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555] text-sm"
                  />
                )}

                {/* Preview Box */}
                {(thumbnailPreview || thumbnailUrl) && (
                  <div className="mt-3 flex items-center gap-3 bg-[#202124] p-3 rounded-xl border border-[#3c4043]">
                    <img
                      src={thumbnailPreview || thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-24 h-14 object-cover rounded-lg border border-[#3c4043]"
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <p className="text-xs text-white font-medium">Thumbnail Selected</p>
                      <p className="text-xs text-green-400">Ready to display</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4285F4] text-white font-semibold py-3.5 rounded-xl hover:bg-[#3367D6] transition-colors disabled:opacity-50 shadow-lg text-sm"
            >
              {loading ? 'Saving to NetMirror...' : 'Publish Movie'}
            </button>
          </form>
        </div>
      </div>
    </AdminGuard>
  );
}
