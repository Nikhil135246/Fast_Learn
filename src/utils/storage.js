// Updated Storage Utility with Reveal Answer Mode Setting

const USERS_KEY = 'fast_learner_users';
const CURRENT_USER_KEY = 'fast_learner_active_user';
const TOPICS_KEY_PREFIX = 'fast_learner_topics_';
const ACTIVE_TOPIC_KEY_PREFIX = 'fast_learner_active_topic_';
const SETTINGS_KEY_PREFIX = 'fast_learner_settings_';

// Helper to generate Squares up to 50
const generateSquares = () => {
  const list = [];
  for (let i = 1; i <= 50; i++) {
    list.push({ key: `${i}²`, value: String(i * i) });
  }
  return list;
};

// Helper to generate Cubes up to 30
const generateCubes = () => {
  const list = [];
  for (let i = 1; i <= 30; i++) {
    list.push({ key: `${i}³`, value: String(i * i * i) });
  }
  return list;
};

// Default Built-in Topics
export const DEFAULT_TOPICS = [
  {
    id: 'ports_numbers',
    name: 'Port & Number',
    isBuiltIn: true,
    mastery: 0,
    data: [
      { key: 'HTTP', value: '80' },
      { key: 'HTTPS', value: '443' },
      { key: 'FTP', value: '21' },
      { key: 'SSH', value: '22' },
      { key: 'DNS', value: '53' },
      { key: 'SMTP', value: '25' },
      { key: 'POP3', value: '110' },
      { key: 'IMAP', value: '143' },
      { key: 'RDP', value: '3389' },
      { key: 'MySQL', value: '3306' }
    ]
  },
  {
    id: 'squares_50',
    name: 'Squares up to 50',
    isBuiltIn: true,
    mastery: 0,
    data: generateSquares()
  },
  {
    id: 'cubes_30',
    name: 'Cubes up to 30',
    isBuiltIn: true,
    mastery: 0,
    data: generateCubes()
  }
];

// Default Settings
export const DEFAULT_SETTINGS = {
  flipMode: false,          // false: Key -> Value, true: Value -> Key
  rapidFireMode: false,     // false: disabled, true: timed question limit
  rapidFireSeconds: 3,      // seconds per question
  adhdMode: true,           // dopamine XP points, streaks & sound chimes
  revealAnswerMode: false,  // reveal answer after 3 wrong attempts or via Reveal button
  sessionDuration: 300      // total session length in seconds (5 mins = 300s)
};

export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const registerUser = (username, password) => {
  const users = getStoredUsers();
  const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existing) {
    return { success: false, message: 'Username already exists' };
  }
  const newUser = { username, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  saveUserTopics(username, DEFAULT_TOPICS);
  saveActiveTopicId(username, 'ports_numbers');
  saveUserSettings(username, DEFAULT_SETTINGS);

  return { success: true, user: newUser };
};

export const loginUser = (username, password) => {
  const users = getStoredUsers();
  const found = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  if (!found) {
    return { success: false, message: 'Invalid username or password' };
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
  return { success: true, user: found };
};

export const getActiveUser = () => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getUserTopics = (username) => {
  if (!username) return DEFAULT_TOPICS;
  try {
    const data = localStorage.getItem(TOPICS_KEY_PREFIX + username.toLowerCase());
    return data ? JSON.parse(data) : DEFAULT_TOPICS;
  } catch (e) {
    return DEFAULT_TOPICS;
  }
};

export const saveUserTopics = (username, topics) => {
  if (!username) return;
  localStorage.setItem(TOPICS_KEY_PREFIX + username.toLowerCase(), JSON.stringify(topics));
};

export const getActiveTopicId = (username) => {
  if (!username) return 'ports_numbers';
  try {
    return localStorage.getItem(ACTIVE_TOPIC_KEY_PREFIX + username.toLowerCase()) || 'ports_numbers';
  } catch (e) {
    return 'ports_numbers';
  }
};

export const saveActiveTopicId = (username, topicId) => {
  if (!username) return;
  localStorage.setItem(ACTIVE_TOPIC_KEY_PREFIX + username.toLowerCase(), topicId);
};

export const getUserSettings = (username) => {
  if (!username) return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY_PREFIX + username.toLowerCase());
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveUserSettings = (username, settings) => {
  if (!username) return;
  localStorage.setItem(SETTINGS_KEY_PREFIX + username.toLowerCase(), JSON.stringify(settings));
};
