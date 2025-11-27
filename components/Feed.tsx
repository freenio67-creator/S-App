import React, { useState } from 'react';
import { Post, User } from '../types';
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { askGeminiTutor } from '../services/geminiService';

interface FeedProps {
  posts: Post[];
  currentUser: User;
  onNewPost: (content: string, tags: string[]) => void;
}

export const Feed: React.FC<FeedProps> = ({ posts, currentUser, onNewPost }) => {
  const [newContent, setNewContent] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!newContent.trim()) return;
    onNewPost(newContent, ['general']);
    setNewContent('');
  };

  const explainPost = async (post: Post) => {
    setLoadingAnalysis(post.id);
    const explanation = await askGeminiTutor("Explain the main point of this post and suggest a quick answer:", post.content);
    setAiAnalysis(prev => ({ ...prev, [post.id]: explanation }));
    setLoadingAnalysis(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Create Post */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex space-x-4">
          <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="What are you studying today?"
              className="w-full bg-slate-50 border-none rounded-lg p-3 focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none h-24"
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Post Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <img src={post.userAvatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{post.userName}</h3>
                    <p className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                {post.content}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">#{tag}</span>
                ))}
              </div>

              {/* AI Help Section */}
              {aiAnalysis[post.id] && (
                <div className="mb-4 bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-sm text-indigo-900">
                  <div className="flex items-center space-x-2 mb-1 font-bold text-indigo-700">
                    <span>✨ AI Insight</span>
                  </div>
                  {aiAnalysis[post.id]}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex space-x-6 text-slate-500">
                  <button className="flex items-center space-x-1.5 hover:text-pink-600 transition">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1.5 hover:text-indigo-600 transition">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">Reply</span>
                  </button>
                  <button className="flex items-center space-x-1.5 hover:text-slate-800 transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                
                <button 
                  onClick={() => explainPost(post)}
                  disabled={loadingAnalysis === post.id}
                  className="text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition"
                >
                  {loadingAnalysis === post.id ? 'Analyzing...' : 'Ask AI to Explain'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};