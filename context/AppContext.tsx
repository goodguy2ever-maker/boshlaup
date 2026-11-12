'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/i18n';
import { isAdminUser } from '@/lib/admin';

export interface UserReview {
  id: string;
  startupId: string;
  startupName: string;
  tag: string;
  content: string;
  createdAt: string;
}

export interface UserProfile {
  id?: string;
  telegramId?: string;
  name: string;
  telegram: string;
  role: string;
  avatar: string;
  badges: string[];
  upvotedIds: string[];
  claimedBonuses: string[];
  isLoggedIn?: boolean;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['ru'];
  investorMode: boolean;
  setInvestorMode: (val: boolean) => void;
  toggleInvestorMode: () => void;
  user: UserProfile;
  isAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  loginWithTelegram: (data: any) => void;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  toggleUpvote: (startupId: string) => Promise<boolean>;
  isUpvoted: (startupId: string) => boolean;
  claimBonus: (startupId: string) => void;
  hasClaimedBonus: (startupId: string) => boolean;
  userReviews: UserReview[];
  addReview: (review: { startupId: string; startupName: string; tag: string; content: string }) => void;
}

const defaultUser: UserProfile = {
  name: "Гость",
  telegram: "",
  role: "founder",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  badges: [],
  upvotedIds: [],
  claimedBonuses: [],
  isLoggedIn: false,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ru');
  const [investorMode, setInvestorModeState] = useState(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);

  // Load from localStorage on client
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('starthub_lang') as Language;
      if (savedLang && ['ru', 'uz', 'en'].includes(savedLang)) {
        setLangState(savedLang);
      }
      const savedUser = localStorage.getItem('starthub_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedUpvotes = localStorage.getItem('starthub_upvotes');
      if (savedUpvotes) {
        setUser(prev => ({ ...prev, upvotedIds: JSON.parse(savedUpvotes) }));
      }
      const savedReviews = localStorage.getItem('starthub_user_reviews');
      if (savedReviews) {
        setUserReviews(JSON.parse(savedReviews));
      }
    } catch (e) {}
  }, []);

  const addReview = (review: { startupId: string; startupName: string; tag: string; content: string }) => {
    const newReview: UserReview = {
      id: 'rev_' + Date.now(),
      startupId: review.startupId,
      startupName: review.startupName,
      tag: review.tag,
      content: review.content,
      createdAt: new Date().toISOString(),
    };
    setUserReviews(prev => {
      const next = [newReview, ...prev];
      try {
        localStorage.setItem('starthub_user_reviews', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const loginWithTelegram = (userData: any) => {
    const isAdm = isAdminUser(userData);
    const updatedUser: UserProfile = {
      ...user,
      id: userData.id,
      telegramId: userData.telegramId,
      name: userData.name || userData.firstName || 'Фаундер',
      telegram: userData.telegram || (userData.username ? `@${userData.username}` : ''),
      role: userData.role || (isAdm ? 'ADMIN' : 'Фаундер'),
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.telegramId}`,
      isLoggedIn: true,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('starthub_user', JSON.stringify(updatedUser));
    } catch (e) {}
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(defaultUser);
    try {
      localStorage.removeItem('starthub_user');
    } catch (e) {}
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('starthub_lang', newLang);
    } catch (e) {}
  };

  const setInvestorMode = (val: boolean) => {
    setInvestorModeState(val);
  };

  const toggleInvestorMode = () => {
    setInvestorMode(!investorMode);
  };

  const isUpvoted = (startupId: string) => {
    return user.upvotedIds.includes(startupId);
  };

  const toggleUpvote = async (startupId: string): Promise<boolean> => {
    const already = isUpvoted(startupId);
    let newUpvotes: string[];
    if (already) {
      newUpvotes = user.upvotedIds.filter(id => id !== startupId);
    } else {
      newUpvotes = [...user.upvotedIds, startupId];
    }
    setUser(prev => ({ ...prev, upvotedIds: newUpvotes }));
    try {
      localStorage.setItem('starthub_upvotes', JSON.stringify(newUpvotes));
      await fetch(`/api/startups/${startupId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: already ? 'unvote' : 'upvote' }),
      });
    } catch (err) {}
    return !already;
  };

  const claimBonus = (startupId: string) => {
    if (!user.claimedBonuses.includes(startupId)) {
      const next = [...user.claimedBonuses, startupId];
      setUser(prev => ({ ...prev, claimedBonuses: next }));
      try {
        localStorage.setItem('starthub_claimed_bonuses', JSON.stringify(next));
      } catch (e) {}
    }
  };

  const hasClaimedBonus = (startupId: string) => {
    return user.claimedBonuses.includes(startupId);
  };

  const t = translations[lang] || translations.ru;

  const isAdmin = isAdminUser(user);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        investorMode,
        setInvestorMode,
        toggleInvestorMode,
        user,
        isAdmin,
        setUser,
        loginWithTelegram,
        logout,
        authModalOpen,
        setAuthModalOpen,
        toggleUpvote,
        isUpvoted,
        claimBonus,
        hasClaimedBonus,
        userReviews,
        addReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
