import { User, Post, UserRole } from '../types';

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@study.com', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/200/200' },
  { id: '2', name: 'John Doe', email: 'john@study.com', role: UserRole.STUDENT, avatar: 'https://picsum.photos/seed/john/200/200' },
  { id: '3', name: 'Jane Smith', email: 'jane@study.com', role: UserRole.STUDENT, avatar: 'https://picsum.photos/seed/jane/200/200' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: '101',
    userId: '2',
    userName: 'John Doe',
    userAvatar: 'https://picsum.photos/seed/john/200/200',
    content: 'Does anyone know how to center a div horizontally and vertically using Flexbox?',
    likes: 5,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    tags: ['css', 'frontend']
  },
  {
    id: '102',
    userId: '3',
    userName: 'Jane Smith',
    userAvatar: 'https://picsum.photos/seed/jane/200/200',
    content: 'Just finished the React documentation. Hooks are amazing but useEffect dependency arrays can be tricky!',
    likes: 12,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    tags: ['react', 'javascript']
  }
];

export const getSessionUser = (): User | null => {
  const stored = localStorage.getItem('study_session_user');
  return stored ? JSON.parse(stored) : INITIAL_USERS[0]; // Default to Admin for demo
};

export const setSessionUser = (user: User) => {
  localStorage.setItem('study_session_user', JSON.stringify(user));
};

export const getPosts = (): Post[] => {
  const stored = localStorage.getItem('study_posts');
  return stored ? JSON.parse(stored) : INITIAL_POSTS;
};

export const addPost = (post: Post) => {
  const posts = getPosts();
  const updated = [post, ...posts];
  localStorage.setItem('study_posts', JSON.stringify(updated));
  return updated;
};

export const getUsers = (): User[] => {
  const stored = localStorage.getItem('study_users');
  return stored ? JSON.parse(stored) : INITIAL_USERS;
};
