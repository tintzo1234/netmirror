'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getMovieById, updateMovie } from '@/lib/firestore';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function EditMoviePage() {
  const { userData } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) getMovieById(id).then((m) => setForm(m));
  }, [id]);

  if (userData?.role !== 'admin' && userData?.role !== 'superadmin') return null;
  if (!form) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm((f: any) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMovie(id, {
        title: form.title,
        description: form.description,
        genre: form.genre,
        year: form.year ? parseInt(form.year) : null,
        rating: form.rating,
        duration: form.duration,
        type: form.type,
        downloadable: form.downloadable,
      });
      toast.success('Updated successfully!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <div className="pt-20 px-4 md:px-8 max-w-3xl mx-auto pb-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[#808080] hover:text-white transition-colors">
            <FaArrowLeft />
          </Link>
          <h1 className="text-white text-2xl font-bold">Edit: {form.title}</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Title</label>
              <input
                name="title"
                value={form.title || ''}
                onChange={handleChange}
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Type</label>
              <select
                name="type"
                value={form.type || 'movie'}
                onChange={handleChange}
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              >
                <option value="movie">Movie</option>
                <option value="series">TV Series</option>
              </select>
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Genre</label>
              <input
                name="genre"
                value={form.genre || ''}
                onChange={handleChange}
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Year</label>
              <input
                name="year"
                value={form.year || ''}
                onChange={handleChange}
                type="number"
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Rating</label>
              <input
                name="rating"
                value={form.rating || ''}
                onChange={handleChange}
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
            </div>
            <div>
              <label className="text-[#808080] text-sm mb-1 block">Duration</label>
              <input
                name="duration"
                value={form.duration || ''}
                onChange={handleChange}
                className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
            </div>
          </div>
          <div>
            <label className="text-[#808080] text-sm mb-1 block">Description</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full bg-[#333] text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914] resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="downloadable"
              checked={form.downloadable || false}
              onChange={handleChange}
              className="w-4 h-4 accent-[#E50914]"
            />
            <span className="text-white text-sm">Allow download</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] text-white font-bold py-4 rounded hover:bg-[#c40812] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
