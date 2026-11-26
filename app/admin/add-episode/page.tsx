'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getAllMovies, addEpisode } from '@/lib/firestore';
import { uploadFile } from '@/lib/storage';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import AdminGuard from '@/components/AdminGuard';

export default function AddEpisodePage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [series, setSeries] = useState<any[]>([]);
  const [form, setForm] = useState({
    movieId: '',
    title: '',
    description: '',
    season: 1,
    episode: 1,
    duration: '',
    downloadable: false,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllMovies().then((m) => setSeries(m.filter((x: any) => x.type === 'series')));
  }, []);

  if (!user && !userData) return null;

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'season' || name === 'episode'
          ? parseInt(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.movieId || !form.title) {
      toast.error('Series and title are required');
      return;
    }
    setLoading(true);
    try {
      let thumbnailUrl = '';
      let videoUrl = '';
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'ep-thumbnails', (p) =>
          setUploadProgress(Math.round(p * 0.3))
        );
      }
      if (videoFile) {
        videoUrl = await uploadFile(videoFile, 'ep-videos', (p) =>
          setUploadProgress(30 + Math.round(p * 0.65))
        );
      }
      await addEpisode({ ...form, thumbnail: thumbnailUrl, videoUrl });
      toast.success('Episode added!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminGuard requiredPassword="admin@3433" storageKey="netmirror_admin_auth" title="Admin Portal Lock">
      <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <div className="pt-20 px-4 md:px-8 max-w-3xl mx-auto pb-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[#808080] hover:text-white transition-colors">
            <FaArrowLeft />
          </Link>
          <h1 className="text-white text-2xl font-bold">Add Episode</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6 space-y-4">
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Select Series *</label>
              <select
                name="movieId"
                value={form.movieId}
                onChange={handleChange}
                required
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              >
                <option value="">Choose a series...</option>
                {series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              {series.length === 0 && (
                <p className="text-[#808080] text-xs mt-1">
                  No series found. Add a series first from{' '}
                  <Link href="/admin/add-movie" className="text-[#E50914] hover:underline">
                    Add Content
                  </Link>
                  .
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#808080] text-sm mb-1 block">Season</label>
                <input
                  type="number"
                  name="season"
                  value={form.season}
                  onChange={handleChange}
                  min={1}
                  className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                />
              </div>
              <div>
                <label className="text-[#808080] text-sm mb-1 block">Episode Number</label>
                <input
                  type="number"
                  name="episode"
                  value={form.episode}
                  onChange={handleChange}
                  min={1}
                  className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                />
              </div>
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Episode Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Episode title"
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914] placeholder-[#555]"
              />
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Episode description..."
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914] placeholder-[#555] resize-none"
              />
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Duration</label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="45m"
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914] placeholder-[#555]"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="downloadable"
                checked={form.downloadable}
                onChange={handleChange}
                className="w-4 h-4 accent-[#E50914]"
              />
              <span className="text-white text-sm">Allow download for this episode</span>
            </label>
          </div>

          <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6 space-y-4">
            <h2 className="text-white font-semibold mb-2">Media Files</h2>
            <div>
              <label className="text-[#808080] text-sm mb-2 block">Episode Thumbnail</label>
              <label className="flex items-center gap-3 bg-[#333] border border-[#444] border-dashed rounded px-4 py-6 cursor-pointer hover:border-[#E50914] transition-colors">
                <FaUpload className="text-[#808080]" />
                <span className="text-[#808080] text-sm">
                  {thumbnailFile ? thumbnailFile.name : 'Upload thumbnail image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-2 block">Episode Video *</label>
              <label className="flex items-center gap-3 bg-[#333] border border-[#444] border-dashed rounded px-4 py-6 cursor-pointer hover:border-[#E50914] transition-colors">
                <FaUpload className="text-[#808080]" />
                <span className="text-[#808080] text-sm">
                  {videoFile ? videoFile.name : 'Upload video file (MP4, WebM)'}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            {loading && uploadProgress > 0 && (
              <div>
                <div className="flex justify-between text-sm text-[#808080] mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#333] rounded-full h-2">
                  <div
                    className="bg-[#E50914] h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] text-white font-bold py-4 rounded hover:bg-[#c40812] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Episode'}
          </button>
        </form>
      </div>
    </div>
    </AdminGuard>
  );
}
