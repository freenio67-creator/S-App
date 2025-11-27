import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Feed } from './components/Feed';
import { CodePlayground } from './components/CodePlayground';
import { AdminPanel } from './components/AdminPanel';
import { AIChat } from './components/AIChat';
import { getSessionUser, getPosts, getUsers, addPost } from './services/mockDb';
import { User, Post, UserRole } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulate initial data load
    const user = getSessionUser();
    if (user) setCurrentUser(user);
    
    setPosts(getPosts());
    setUsers(getUsers());
  }, []);

  const handleNewPost = (content: string, tags: string[]) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      likes: 0,
      timestamp: new Date().toISOString(),
      tags
    };
    const updatedPosts = addPost(newPost);
    setPosts(updatedPosts);
  };

  const handleLogout = () => {
    alert("Logged out (Simulation)");
    // In real app, clear token and redirect
  };

  if (!currentUser) return <div className="flex h-screen items-center justify-center text-slate-500">Loading Community...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation 
        currentUser={currentUser} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-64 p-8 h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">
              {activeTab === 'feed' ? 'Community Feed' : activeTab.replace('-', ' ')}
            </h2>
            <p className="text-slate-500 text-sm">Welcome back, {currentUser.name}</p>
          </div>
          <div className="flex items-center space-x-2">
             {currentUser.role !== UserRole.ADMIN && activeTab !== 'tutor' && (
               <button 
                 onClick={() => setActiveTab('tutor')}
                 className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
               >
                 Need Help? Ask AI
               </button>
             )}
          </div>
        </header>

        <div className="h-[calc(100vh-140px)]">
          {activeTab === 'feed' && (
            <Feed posts={posts} currentUser={currentUser} onNewPost={handleNewPost} />
          )}

          {activeTab === 'code' && (
            <CodePlayground />
          )}

          {activeTab === 'tutor' && (
            <AIChat />
          )}

          {activeTab === 'admin' && (
            currentUser.role === UserRole.ADMIN ? (
              <AdminPanel users={users} posts={posts} />
            ) : (
              <div className="text-center py-20 text-red-500">Access Restricted</div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default App;