import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { BlogPost } from '../types';
import { Edit2, Plus, Calendar, User, Tag, ArrowLeft, Eye, X, BookOpen, Trash } from 'lucide-react';

interface BlogViewProps {
  onBack: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onBack }) => {
  const { blogs, currentUser, language, editBlogPost, addBlogPost, deleteBlogPost } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [readingBlog, setReadingBlog] = useState<BlogPost | null>(null);
  
  // State for Admin edit dialog
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Blog form states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogCategory, setBlogCategory] = useState('organic');
  const [blogImage, setBlogImage] = useState('');
  const [blogTags, setBlogTags] = useState('');

  const isAdmin = currentUser && currentUser.role === 'Admin';

  // Categories
  const categories = ['all', 'organic', 'farming', 'nutrition', 'lifestyle'];

  const getCategoryLabelBn = (cat: string) => {
    switch(cat) {
      case 'all': return 'সব বিষয়';
      case 'organic': return 'জৈব ফসল ও স্বাস্থ্য';
      case 'farming': return 'কৃষি প্রযুক্তি';
      case 'nutrition': return 'পুষ্টি ও রেসিপি';
      case 'lifestyle': return 'সুস্থ জীবনযাপন';
      default: return cat;
    }
  };

  const filteredBlogs = blogs.filter(b => {
    return selectedCategory === 'all' || b.category === selectedCategory;
  });

  const handleEditClick = (blog: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogSummary(blog.summary);
    setBlogContent(blog.content);
    setBlogAuthor(blog.author);
    setBlogCategory(blog.category);
    setBlogImage(blog.image);
    setBlogTags(blog.tags.join(', '));
  };

  const handleCreateClick = () => {
    setIsCreatingNew(true);
    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
    setBlogAuthor(currentUser?.name || 'কৃষক বাজার অ্যাডমিন');
    setBlogCategory('organic');
    setBlogImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80');
    setBlogTags('organic, fresh, healthy');
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogAuthor || !blogContent) {
      alert('অনুগ্রহ করে প্রয়োজনীয় তথ্যসমূহ প্রদান করুন।');
      return;
    }

    const tagsArr = blogTags.split(',').map(t => t.trim()).filter(Boolean);
    const postData = {
      title: blogTitle,
      summary: blogSummary,
      content: blogContent,
      category: blogCategory,
      author: blogAuthor,
      image: blogImage || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      tags: tagsArr
    };

    if (editingBlog) {
      editBlogPost(editingBlog.id, postData);
      setEditingBlog(null);
    } else {
      addBlogPost(postData);
      setIsCreatingNew(false);
    }
  };

  const handleDeleteClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('আপনি কি নিশ্চিতভাবে এই আর্টিকেলটি মুছে ফেলতে চান?')) {
      deleteBlogPost(postId);
      if (readingBlog && readingBlog.id === postId) {
        setReadingBlog(null);
      }
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 pb-20 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <button onClick={onBack} className="hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> {language === 'en' ? 'Back to Home' : 'হোমপেজে ফিরুন'}
            </button>
            <span>/</span>
            <span className="text-gray-800 font-bold">{language === 'en' ? 'Krishok Bazar Blog' : 'কৃষি বার্তা ও সতেজ ব্লগ'}</span>
          </div>

          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              {language === 'en' ? 'Write New Blog' : 'নতুন আর্টিকেল লিখুন'}
            </button>
          )}
        </div>

        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2 select-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            🌱 {language === 'en' ? 'Krishok Bazar News' : 'কৃষক বার্তা ও সচেতনতা ফোরাম'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight block">
            {language === 'en' ? 'Healthy Living & Agriculture Insights' : 'সুস্থ জীবনযাপন ও নির্ভরযোগ্য আধুনিক কৃষি তথ্য'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {language === 'en' 
              ? 'Stay updated with safe farming methods, nutrition guides, and direct farmer empowerment stories.'
              : 'কীটনাশকমুক্ত চাষাবাদ, সঠিক পুষ্টি গুণাবলী, এবং মধ্যস্বত্বভোগীদের কমিশন সংস্কৃতি ভাঙার বৈপ্লবিক গল্পসমূহ পড়ুন ও শেয়ার করুন।'}
          </p>
        </div>

        {/* Category Switcher Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {language === 'en' ? (cat === 'all' ? 'All Subjects' : cat.toUpperCase()) : getCategoryLabelBn(cat)}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid list */}
        {filteredBlogs.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-3xl border border-gray-150 flex flex-col items-center justify-center p-8 gap-3">
            <span className="text-4xl">📚</span>
            <p className="text-sm font-black text-gray-800">
              {language === 'en' ? 'No Articles Found' : 'এই ক্যাটাগরিতে কোনো আর্টিকেল পাওয়া যায়নি।'}
            </p>
            {isAdmin && (
              <button
                onClick={handleCreateClick}
                className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
              >
                প্রথম আর্টিকেলটি আপনিই লিখুন!
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <article 
                key={post.id}
                onClick={() => setReadingBlog(post)}
                className="group flex flex-col rounded-3xl border border-gray-150/60 bg-white hover:border-emerald-250 hover:shadow-xl transition-all overflow-hidden cursor-pointer"
              >
                {/* Image Cover */}
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 rounded-xl bg-emerald-600 px-3 py-1 text-[10px] font-black text-white shadow-md uppercase tracking-wide">
                    {post.category}
                  </span>
                  
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                      <button
                        onClick={(e) => handleEditClick(post, e)}
                        className="p-2 rounded-xl bg-white hover:bg-blue-50 text-blue-600 shadow-lg border border-gray-100 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(post.id, e)}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 text-red-600 shadow-lg border border-gray-100 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        title="মুছে ফেলুন"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content block */}
                <div className="p-6 flex-1 flex flex-col space-y-3 font-sans">
                  {/* Meta taggers */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'আজ'}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {post.author}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed font-semibold line-clamp-3">
                    {post.summary}
                  </p>

                  <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between text-xs font-black text-emerald-700">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {language === 'en' ? 'Read Article' : 'সম্পূর্ণ আর্টিকেল পড়ুন'}
                    </span>
                    <span className="text-[10px] text-gray-300 font-normal">
                      {post.tags.slice(0, 2).map(t => `#${t}`).join(' ')}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* MODAL 1: FULL BLOG READER VIEW */}
      {readingBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative font-sans">
            {/* Close Button top-right corner */}
            <button
              onClick={() => setReadingBlog(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all cursor-pointer hover:rotate-90"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Sticky Admin Quick Controls */}
            {isAdmin && (
              <div className="bg-blue-50 border-b border-blue-100 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-blue-800">
                <span>⚡ আপনি অ্যাডমিন হিসেবে এই ব্লগ পৃষ্ঠাটি দেখছেন।</span>
                <button
                  onClick={(e) => { setReadingBlog(null); handleEditClick(readingBlog, e); }}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1"
                >
                  সরাসরি এডিট করুন
                </button>
              </div>
            )}

            {/* Full-width image cover */}
            <div className="h-64 sm:h-80 w-full overflow-hidden bg-gray-100 relative">
              <img
                src={readingBlog.image}
                alt={readingBlog.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 sm:p-8 flex flex-col justify-end text-left select-none text-white">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300">
                  🧬 {readingBlog.category}
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black mt-1 leading-tight">
                  {readingBlog.title}
                </h1>
              </div>
            </div>

            {/* Body contents */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Meta information details */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 border-b border-gray-100 pb-4">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4 text-emerald-600" />
                  {language === 'en' ? 'By' : 'লেখক:'} <strong className="text-gray-800">{readingBlog.author}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {readingBlog.publishedAt ? new Date(readingBlog.publishedAt).toLocaleDateString() : 'আজ'}
                </span>
                <span>•</span>
                <span className="inline-flex gap-1.5">
                  <Tag className="h-4 w-4" />
                  {readingBlog.tags.map(t => (
                    <span key={t} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase">
                      {t}
                    </span>
                  ))}
                </span>
              </div>

              {/* HTML/Markdown Content formatting */}
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line space-y-4">
                <p className="font-bold text-gray-900 border-l-4 border-emerald-500 pl-3 italic mb-4">
                  {readingBlog.summary}
                </p>
                {readingBlog.content}
              </div>

              {/* Go Back CTA button */}
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setReadingBlog(null)}
                  className="rounded-xl px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black transition-all cursor-pointer"
                >
                  {language === 'en' ? 'Close Reader' : 'পঠন মোড বন্ধ করুন ✖'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIN EDIT AND CREATOR FORM */}
      {(editingBlog || isCreatingNew) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative font-sans">
            <button
              onClick={() => { setEditingBlog(null); setIsCreatingNew(false); }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-6 flex items-center gap-1.5 border-b border-gray-100 pb-3">
              🔑 {editingBlog ? 'অ্যাডমিন ব্লগ মডারেটর (Edit Blog)' : 'নতুন ব্লগ কন্টেন্ট লিখুন (Create Blog)'}
            </h2>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">আর্টিকেল শিরোনাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: কীটনাশকের স্বাস্থ্যঝুঁকি ও প্রাকৃতিক সমাধান"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-medium outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 font-sans">লেখক / অ্যাডমিন নাম</label>
                  <input
                    type="text"
                    required
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 font-sans">ব্লগ ক্যাটাগরি</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-semibold bg-white"
                  >
                    <option value="organic">organic - জৈব খাবার</option>
                    <option value="farming">farming - কৃষি প্রযুক্তি</option>
                    <option value="nutrition">nutrition - পুষ্টি ও রেসিপি</option>
                    <option value="lifestyle">lifestyle - জীবনযাপন</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 font-sans">কভার থাম্বনেইল ছবি লিংক (Image URL)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={blogImage}
                  onChange={(e) => setBlogImage(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ট্যাগ সমূহ (কমা দিয়ে আলাদা করুন)</label>
                <input
                  type="text"
                  placeholder="organic, fresh, bangladesh, safe_food"
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">আর্টিকেল সারসংক্ষেপ (Brief Summary)</label>
                <textarea
                  rows={2}
                  value={blogSummary}
                  onChange={(e) => setBlogSummary(e.target.value)}
                  placeholder="খুব সংক্ষেপে ১/২ লাইনে মুখবন্ধ লিখুন যা রিডারকে আকর্ষিত করবে..."
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-medium outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">সম্পূর্ণ আর্টিকেল কন্টেন্ট (Full Content)</label>
                <textarea
                  rows={6}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="আপনার নির্ভরযোগ্য আর্টিকেল কন্টেন্ট তথ্যসমৃদ্ধভাবে এখানে বিস্তারিত লিখুন..."
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-medium outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => { setEditingBlog(null); setIsCreatingNew(false); }}
                  className="w-1/3 rounded-xl border border-gray-200 py-3 text-xs font-extrabold text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-black cursor-pointer shadow-md"
                >
                  {editingBlog ? 'পরিবর্তন সংরক্ষণ করুন ✔' : 'নতুন ব্লগ পোস্ট করুন ✔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
