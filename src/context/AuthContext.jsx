import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getActiveUser,
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
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
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [activeTopicId, setActiveTopicId] = useState('ports_numbers');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [toastMessage, setToastMessage] = useState(null);
  const [activeSessionResults, setActiveSessionResults] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'auth', 'home', 'upload', 'session', 'results'

  useEffect(() => {
    const active = getActiveUser();
    if (active) {
      setUser(active);
      const userTopics = getUserTopics(active.username);
      setTopics(userTopics);
      
      const topicId = getActiveTopicId(active.username);
      setActiveTopicId(topicId);

      const userSettings = getUserSettings(active.username);
      setSettings(userSettings);

      setCurrentPage('home');
    } else {
      setCurrentPage('auth');
    }
  }, []);

  const login = (username, password) => {
    const res = apiLogin(username, password);
    if (res.success) {
      setUser(res.user);
      const userTopics = getUserTopics(res.user.username);
      setTopics(userTopics);
      
      const topicId = getActiveTopicId(res.user.username);
      setActiveTopicId(topicId);

      const userSettings = getUserSettings(res.user.username);
      setSettings(userSettings);

      setCurrentPage('home');
    }
    return res;
  };

  const signup = (username, password) => {
    const res = apiRegister(username, password);
    if (res.success) {
      return login(username, password);
    }
    return res;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setTopics(DEFAULT_TOPICS);
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
    const updated = [...topics, topicToAdd];
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
    const updated = topics.map(t => (t.id === id ? updatedTopic : t));
    setTopics(updated);
    if (user) {
      apiSaveTopics(user.username, updated);
    }
    showToast('Topic saved successfully');
  };

  // Update Topic Mastery Accuracy Percentage
  const updateTopicMastery = (topicId, accuracy) => {
    const updated = topics.map(t => {
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
    const filtered = topics.filter(t => t.id !== id);
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
    <AuthContext.Provider
      value={{
        user,
        topics,
        activeTopicId,
        activeTopic,
        settings,
        toastMessage,
        activeSessionResults,
        currentPage,
        login,
        signup,
        logout,
        selectTopic,
        addTopic,
        updateTopic,
        updateTopicMastery,
        deleteTopic,
        updateSettings,
        updateSessionTime,
        showToast,
        setActiveSessionResults,
        navigateTo
      }}
    >
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
