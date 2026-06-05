/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FarmerPost, PostComment } from '../types';
import { ThumbsUp, MessageSquare, Send, Plus, Trash2, Video, Image, Play, ExternalLink, MessageCircle } from 'lucide-react';

export function parseYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

/**
 * Counts the aggregate number of top-level and recursive nested replies so comment metrics are perfectly accurate.
 */
function countComments(comments: PostComment[]): number {
  if (!comments) return 0;
  let count = comments.length;
  for (const c of comments) {
    if (c.replies && c.replies.length > 0) {
      count += countComments(c.replies);
    }
  }
  return count;
}

/**
 * Recursive Comment Node to handle reply nesting aesthetics and user interactions safely.
 */
const CommentNode: React.FC<{
  comment: PostComment;
  postId: string;
  onReplySubmit: (postId: string, text: string, parentCommentId?: string) => void;
  currentUser: any;
  depth?: number;
}> = ({ comment, postId, onReplySubmit, currentUser, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit(postId, replyText.trim(), comment.id);
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className={`mt-3 ${depth > 0 ? 'ml-5 sm:ml-7 pl-3 border-l-2 border-emerald-100/70' : ''}`} id={`comment-node-${comment.id}`}>
      <div className="bg-white rounded-2xl border border-gray-150/70 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black text-gray-800 leading-tight">
              {comment.userName}
            </span>
            {comment.farmerId && (
              <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-1 py-0.2 rounded-xs font-extrabold shrink-0 uppercase tracking-wide">
                কৃষক
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono font-medium text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString('bn-BD', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1.5 leading-relaxed font-semibold pr-2">
          {comment.content}
        </p>

        {/* Action tray for comments */}
        {currentUser && (
          <div className="mt-1.5 flex items-center gap-2">
            <button
               onClick={() => setShowReplyForm(!showReplyForm)}
               className="text-[10px] text-emerald-700 hover:text-emerald-900 font-extrabold flex items-center gap-1 cursor-pointer select-none active:scale-95 transition-colors"
            >
              <MessageSquare className="h-3 w-3" /> উত্তর দিন
            </button>
          </div>
        )}

        {/* Inline nested reply input */}
        {showReplyForm && (
          <form onSubmit={handleSubmit} className="mt-2.5 flex gap-1.5 animate-fadeIn">
            <input
              type="text"
              required
              placeholder={`@${comment.userName}-কে উত্তর দিন...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 rounded-xl bg-gray-50 border border-emerald-150 py-1.5 px-3.5 text-[11px] outline-none focus:border-emerald-500 focus:bg-white text-gray-700"
            />
            <button
              type="submit"
              className="rounded-xl px-4 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-xs text-[10px] font-black flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            >
              পাঠান
            </button>
          </form>
        )}
      </div>

      {/* Render children comments recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplySubmit={onReplySubmit}
              currentUser={currentUser}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FarmerSocialFeed: React.FC = () => {
  const { posts, addPost, likePost, commentPost, deletePost, currentUser } = useApp();
  
  // Posting states
  const [content, setContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<'image' | 'video'>('image');
  const [mediaList, setMediaList] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const isFarmer = currentUser?.role === 'Farmer';
  const isAdmin = currentUser?.role === 'Admin';

  const handleAddMedia = () => {
    if (!urlInput.trim()) return;
    setMediaList(prev => [...prev, { type: urlType, url: urlInput.trim() }]);
    setUrlInput('');
  };

  const handleRemoveMedia = (idx: number) => {
    setMediaList(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaList.length === 0) return;

    const images = mediaList.filter(m => m.type === 'image').map(m => m.url);
    const videos = mediaList.filter(m => m.type === 'video').map(m => m.url);

    addPost(content, images, videos);
    
    // Clear form
    setContent('');
    setMediaList([]);
    setUrlInput('');
  };

  const handleCommentSubmit = (postId: string, text: string, parentCommentId?: string) => {
    if (!text || !text.trim()) return;
    commentPost(postId, text.trim(), parentCommentId);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="w-full font-sans select-none" id="farmer-social-yard">
      {/* Posting box for Farmers */}
      {(isFarmer || isAdmin) && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-5 mb-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black uppercase shrink-0 text-xs">
              {currentUser?.name?.slice(0, 2) || 'KM'}
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">কৃষকের উঠান ফিডে শেয়ার করুন</h3>
              <p className="text-xs text-emerald-800 font-bold mt-0.5">
                {isAdmin ? '🛡️ প্যানেল পরিচালক (Admin): ' : '🌾 অংশীদার খামারি (Farmer): '}
                {currentUser?.name}
              </p>
            </div>
          </div>

          <form onSubmit={handlePublishPost} className="pt-4 space-y-4">
            <textarea
              required
              rows={3}
              placeholder="আজ আপনার খামারে কি নতুন ফসল উঠলো? আপনার কৃষি পণ্য বা দৈনিক কাজ সম্পর্কিত কোনো অভিজ্ঞতা ক্রেতাদের সাথে শেয়ার করুন..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border-0 focus:ring-0 outline-none resize-none text-xs sm:text-sm text-gray-700 leading-relaxed placeholder:text-gray-400"
            />

            {/* Media list preview */}
            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                {mediaList.map((media, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 border border-gray-200/50 flex flex-col justify-between p-2 group">
                    {media.type === 'image' ? (
                      <>
                        <img src={media.url} alt="Post preview" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="relative z-10 bg-black/60 text-[8px] text-white font-bold px-1.5 py-0.5 rounded-md w-fit">📷 ফটো</span>
                      </>
                    ) : (
                      <>
                        {parseYoutubeEmbedUrl(media.url) ? (
                          <iframe
                            src={parseYoutubeEmbedUrl(media.url)!}
                            title="YouTube Preview"
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            frameBorder="0"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                            <Video className="h-6 w-6 text-emerald-500" />
                          </div>
                        )}
                        <span className="relative z-10 bg-emerald-700 text-[8px] text-white font-bold px-1.5 py-0.5 rounded-md w-fit flex items-center gap-0.5">🎬 ইউটিউব ভিডিও</span>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-2 right-2 z-20 h-6 w-6 rounded-full bg-red-650 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-90"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* URL Collector area */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-2xl space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-emerald-800 font-extrabold flex items-center gap-1">
                  🌐 মিডিয়া লিংক সাপোর্ট (ফটো/ইউটিউব ভিডিও)
                </span>
                <div className="flex rounded-lg border border-emerald-200 p-0.5 bg-white text-[9px] font-bold">
                  <button
                    type="button"
                    onClick={() => setUrlType('image')}
                    className={`px-2 py-1 rounded-md transition-all ${urlType === 'image' ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}
                  >
                    📷 ছবি লিংক
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlType('video')}
                    className={`px-2 py-1 rounded-md transition-all ${urlType === 'video' ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}
                  >
                    🎬 ইউটিউব লিংক
                  </button>
                </div>
              </div>

              <div className="flex gap-1.5">
                <input
                  type="url"
                  placeholder={urlType === 'image' ? 'যেমন: https://images.unsplash.com/...' : 'ইউটিউব ভিডিওর পেস্ট করুন (যেমন: https://youtu.be/...)'}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 rounded-xl bg-white border border-emerald-150 py-2 px-3 text-xs outline-none text-gray-700"
                />
                <button
                  type="button"
                  onClick={handleAddMedia}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 text-xs font-bold shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> যুক্ত করুন
                </button>
              </div>
            </div>

            {/* Form footer */}
            <div className="flex justify-between items-center pt-2">
              <p className="text-[10px] text-gray-400 font-medium leading-tight">
                * ইউটিউব ভিডিও লিংক সরাসরি এম্বেড হয়ে প্লে হওয়ার সুবিধা পাবেন। ছবি ও ভিডিও ক্রেতারা সরাসরি ব্রাউজ করতে পারবেন।
              </p>
              <button
                type="submit"
                className="rounded-xl px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" /> উঠানে পোস্ট দিন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post feed representation */}
      <div className="max-w-xl mx-auto space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-8">
            <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-gray-800">এখনও কোনো পোস্ট করা হয়নি!</h4>
            <p className="text-xs text-gray-400 mt-1"> সম্মানিত খামারিগণ খুব শীঘ্রই তাদের খামারের আসল আপডেট শেয়ার করবেন।</p>
          </div>
        ) : (
          posts.map((post) => {
            const hasLiked = currentUser && post.likedByUserIds?.includes(currentUser.id);
            const isPostOwner = currentUser && (currentUser.farmerId === post.farmerId || currentUser.id === post.farmerId);
            const canDelete = isAdmin || isPostOwner;
            const commentsTotal = countComments(post.comments || []);

            return (
              <div key={post.id} className="bg-white rounded-3xl border border-gray-150/65 shadow-xs overflow-hidden" id={`post-${post.id}`}>
                {/* Header info */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden font-sans">
                      {post.avatar === 'female' ? (
                        <span className="text-lg">👩‍🌾</span>
                      ) : (
                        <span className="text-lg">👨‍🌾</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-black text-gray-800 hover:text-emerald-700 transition-colors cursor-pointer leading-tight">
                          {post.farmerName}
                        </span>
                        <span className="rounded bg-emerald-50 border border-emerald-100 text-[8px] font-black text-emerald-800 px-1 py-0.2 shrink-0">
                          অংশীদার খামারি
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium font-mono leading-none mt-1 block">
                        {new Date(post.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 shrink-0 cursor-pointer transition-all active:scale-90"
                      title="পোস্টটি মুছে ফেলুন"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Content description */}
                <div className="px-5 pb-4">
                  <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Media representation - Dynamic Photos & YouTube Videos */}
                {(post.images?.length > 0 || post.videos?.length > 0) && (
                  <div className="border-t border-b border-gray-50 bg-gray-50/50 p-1 space-y-2">
                    {/* Render standard photo links */}
                    {post.images && post.images.map((img, index) => (
                      <div key={`img-${index}`} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-150/40 bg-white">
                        <img
                          src={img}
                          alt="Post attachment"
                          className="w-full h-full object-cover object-center"
                          referrerPolicy="no-referrer"
                        />
                        <a
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 bottom-3 bg-black/60 hover:bg-black/80 text-white rounded-lg p-1.5 text-[9px] font-bold flex items-center gap-1 shrink-0 backdrop-blur-xs transition-all shadow-md cursor-pointer"
                        >
                          <ExternalLink className="h-3 w-3" /> মূল ফটো লিংক
                        </a>
                      </div>
                    ))}

                    {/* Render YouTube interactive responsive video embeds */}
                    {post.videos && post.videos.map((vid, index) => {
                      const embedUrl = parseYoutubeEmbedUrl(vid);
                      return (
                        <div key={`vid-${index}`} className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black border border-gray-900 shadow-md">
                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              title={`YouTube Real Farmer's Video ${index}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              frameBorder="0"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white p-5 text-center">
                              <Video className="h-10 w-10 text-emerald-500 mb-2 shrink-0 animate-pulse" />
                              <p className="text-xs font-bold mb-3 px-3 truncate max-w-xs">{vid}</p>
                              <a
                                href={vid}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-transform active:scale-95 mx-auto"
                              >
                                <Play className="h-3.5 w-3.5 fill-current" /> সরাসরি ভিডিও প্লে করুন
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Interaction summary bar */}
                <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all active:scale-90 cursor-pointer ${
                        hasLiked 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'hover:bg-gray-50 text-gray-500 border border-transparent'
                      }`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-emerald-600 text-emerald-700' : ''}`} />
                      <span>{post.likes} লাইক</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all hover:bg-gray-50 text-gray-500 cursor-pointer border border-transparent`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{commentsTotal} মন্তব্য</span>
                    </button>
                  </div>
                </div>

                {/* Comments box area */}
                {expandedComments[post.id] && (
                  <div className="bg-gray-50/70 border-t border-gray-100 p-5 space-y-4">
                    {/* Existing nested comment log list */}
                    {post.comments?.length > 0 && (
                      <div className="space-y-1">
                        {post.comments.map((comment) => (
                          <CommentNode
                            key={comment.id}
                            comment={comment}
                            postId={post.id}
                            onReplySubmit={handleCommentSubmit}
                            currentUser={currentUser}
                          />
                        ))}
                      </div>
                    )}

                    {/* Write new top-level comment form */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const txt = commentInputs[post.id];
                        if (!txt || !txt.trim()) return;
                        handleCommentSubmit(post.id, txt.trim());
                        setCommentInputs(prev => ({ ...prev, [post.id]: '' }));
                        setExpandedComments(prev => ({ ...prev, [post.id]: true }));
                      }} 
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        required
                        placeholder="আপনার মূল্যবান মতামতটি এখানে লিখুন..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 rounded-2xl bg-white border border-gray-200 py-2.5 px-4 text-xs outline-none focus:border-emerald-500 text-gray-700"
                      />
                      <button
                        type="submit"
                        className="rounded-2xl h-10 w-10 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-md active:scale-95 transition-all cursor-pointer"
                        title="মন্তব্য জমা দিন"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
