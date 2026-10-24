import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  getUserTopics,
  saveUserTopics as apiSaveTopics,
  getActiveTopicId,
  saveActiveTopicId as apiSaveActiveTopicId,
  getUserSettings,
  saveUserSettings as apiSaveSettings,
  DEFAULT_TOPICS,
  DEFAULT_SETTINGS
} from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const topicsRef = useRef(topics);
  const [activeTopicId, setActiveTopicId] = useState('ports_numbers');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSessionResults, setActiveSessionResults] = useState(null);
  const [currentPage, setCurrentPage] = useState('auth');

  // Keep topicsRef in sync with topics state
  useEffect(() => {
    topicsRef.current = topics;
  }, [topics]);

  const loadUserData = async (username) => {
    const userTopics = await getUserTopics(username);
    setTopics(userTopics);
    const topicId = await getActiveTopicId(username);
    setActiveTopicId(topicId);
    const userSettings = await getUserSettings(username);
    setSettings(userSettings);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isSignedIn = puter.auth.isSignedIn();
        if (isSignedIn) {
          const puterUser = await puter.auth.getUser();
          setUser({ username: puterUser.username });
          await loadUserData(puterUser.username);
          setCurrentPage('home');
        } else {
          setCurrentPage('auth');
        }
      } catch (e) {
        console.error('Auth check failed:', e);
        setCurrentPage('auth');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async () => {
    try {
      await puter.auth.signIn();
      const puterUser = await puter.auth.getUser();
      setUser({ username: puterUser.username });
      await loadUserData(puterUser.username);
      setCurrentPage('home');
      return { success: true };
    } catch (e) {
      console.error('Login failed:', e);
      return { success: false, message: 'Sign-in was cancelled or failed.' };
    }
  };

  const logout = async () => {
    try {
      await puter.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    setTopics(DEFAULT_TOPICS);
    setSettings(DEFAULT_SETTINGS);
    setCurrentPage('auth');
  };

  // Select Active Topic
  const selectTopic = (id) => {
    setActiveTopicId(id);
    if (user) {
      apiSaveActiveTopicId(user.username, id);
    }
  };

  // Add New Topic (from CSV upload or manual creation)
  const addTopic = (newTopic) => {
    const topicToAdd = { mastery: 0, ...newTopic };
    const updated = [...topicsRef.current, topicToAdd];
    setTopics(updated);
    setActiveTopicId(topicToAdd.id);
    if (user) {
      apiSaveTopics(user.username, updated);
      apiSaveActiveTopicId(user.username, topicToAdd.id);
    }
    showToast(`Topic "${topicToAdd.name}" created`);
  };

  // Update existing Topic
  const updateTopic = (id, updatedTopic) => {
    const updated = topicsRef.current.map(t => (t.id === id ? updatedTopic : t));
    setTopics(updated);
    if (user) {
      apiSaveTopics(user.username, updated);
    }
    showToast('Topic saved successfully');
  };

  // Update Topic Mastery Accuracy Percentage
  const updateTopicMastery = (topicId, accuracy) => {
    const updated = topicsRef.current.map(t => {
      if (t.id === topicId) {
        // Keep highest mastery percentage achieved
        const newMastery = Math.max(t.mastery || 0, accuracy);
        return { ...t, mastery: newMastery };
      }
      return t;
    });
    setTopics(updated);
    if (user) {
      apiSaveTopics(user.username, updated);
    }
  };

  // Delete Topic
  const deleteTopic = (id) => {
    const filtered = topicsRef.current.filter(t => t.id !== id);
    setTopics(filtered);
    if (activeTopicId === id && filtered.length > 0) {
      setActiveTopicId(filtered[0].id);
      if (user) apiSaveActiveTopicId(user.username, filtered[0].id);
    }
    if (user) {
      apiSaveTopics(user.username, filtered);
    }
    showToast('Topic deleted');
  };

  // Update Practice Settings
  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    if (user) {
      apiSaveSettings(user.username, merged);
    }
  };

  const updateSessionTime = (seconds) => {
    updateSettings({ sessionDuration: seconds });
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0] || {
    id: 'default',
    name: 'Default',
    data: [],
    mastery: 0
  };

  return (
    <AuthContext.Provider value={{
      user, loading, topics, activeTopicId, activeTopic, settings,
      toastMessage, activeSessionResults, currentPage,
      login, logout, selectTopic, addTopic, updateTopic,
      updateTopicMastery, deleteTopic, updateSettings,
      updateSessionTime, showToast, setActiveSessionResults, navigateTo,
      sessionTime: settings?.sessionDuration || 300
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
