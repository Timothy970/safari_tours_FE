'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { BlogPost } from '../../types';
import AdminPaginationBar from './AdminPaginationBar';

export interface AdminBlogsTabProps {
  blogsList: BlogPost[];
  searchBlogs: string;
  setSearchBlogs: (val: string) => void;
  blogsPage: number;
  blogsTotalPages: number;
  blogsTotal: number;
  setBlogsPage: (page: number) => void;
  setIsBlogModalOpen: (open: boolean) => void;
  setEditingBlogId: (id: number | null) => void;
  setBlogForm: (form: any) => void;
  handleDeleteBlog: (id: number, title: string) => void;
  handleToggleBlogPublish: (id: number, current: boolean) => Promise<void>;
}

export default function AdminBlogsTab({
  blogsList,
  searchBlogs,
  setSearchBlogs,
  blogsPage,
  blogsTotalPages,
  blogsTotal,
  setBlogsPage,
  setIsBlogModalOpen,
  setEditingBlogId,
  setBlogForm,
  handleDeleteBlog,
  handleToggleBlogPublish,
}: AdminBlogsTabProps) {
  const filteredBlogs = blogsList.filter((b) =>
    b.title.toLowerCase().includes(searchBlogs.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search safari guide articles..."
            value={searchBlogs}
            onChange={(e) => setSearchBlogs(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F1D36]"
          />
        </div>

        <button
          onClick={() => {
            setEditingBlogId(null);
            setBlogForm({
              title: '',
              slug: '',
              category: 'Trail Guides',
              cover_image_url: '',
              author_name: 'Kibali Safari Guide',
              read_time_minutes: 5,
              is_published: true,
              excerpt: '',
              content: '',
            });
            setIsBlogModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write Guide Article</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              <th className="py-3">Article Title</th>
              <th className="py-3">Category</th>
              <th className="py-3">Author</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBlogs.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 font-bold text-[#0F1D36]">{b.title}</td>
                <td className="py-3.5">{b.category}</td>
                <td className="py-3.5">{b.author_name}</td>
                <td className="py-3.5">
                  <button
                    onClick={() => handleToggleBlogPublish(b.id, b.is_published)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      b.is_published ? 'bg-emerald-50 text-[#15803D]' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {b.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setEditingBlogId(b.id);
                        setBlogForm({ ...b });
                        setIsBlogModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(b.id, b.title)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminPaginationBar
        currentPage={blogsPage}
        totalPages={blogsTotalPages}
        totalItems={blogsTotal}
        onPageChange={setBlogsPage}
        itemsLabel="articles"
      />
    </div>
  );
}
