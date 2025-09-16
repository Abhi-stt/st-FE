const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('storyUser');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token || null;
  }
  return null;
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData: { email: string; password: string; username: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    // Use demo-login endpoint which works with email and password
    const response = await fetch(`${API_BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store user data with token
    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.full_name || data.user.email.split('@')[0],
      token: data.token,
    };
    
    localStorage.setItem('storyUser', JSON.stringify(userData));
    
    return data;
  },

  // Logout user
  logout: async () => {
    try {
      await makeAuthenticatedRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('storyUser');
    }
  },

  // Get user profile
  getProfile: async () => {
    return makeAuthenticatedRequest('/auth/profile');
  },

  // Update user profile
  updateProfile: async (profileData: { full_name?: string; avatar_url?: string }) => {
    return makeAuthenticatedRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Stories API
export const storiesAPI = {
  // Create new story
  create: async (storyData: {
    title: string;
    description?: string;
    theme: string;
    art_style: string;
    character_name?: string;
    character_age?: number;
    character_gender?: string;
  }) => {
    return makeAuthenticatedRequest('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  },

  // Get user's stories
  getAll: async (page = 1, limit = 10) => {
    return makeAuthenticatedRequest(`/stories?page=${page}&limit=${limit}`);
  },

  // Get specific story
  getById: async (storyId: string) => {
    return makeAuthenticatedRequest(`/stories/${storyId}`);
  },

  // Update story
  update: async (storyId: string, updates: any) => {
    return makeAuthenticatedRequest(`/stories/${storyId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete story
  delete: async (storyId: string) => {
    return makeAuthenticatedRequest(`/stories/${storyId}`, {
      method: 'DELETE',
    });
  },

  // Get public stories
  getPublic: async (page = 1, limit = 10) => {
    return makeAuthenticatedRequest(`/stories/public?page=${page}&limit=${limit}`);
  },

  // Toggle story visibility
  toggleVisibility: async (storyId: string) => {
    return makeAuthenticatedRequest(`/stories/${storyId}/toggle-visibility`, {
      method: 'PATCH',
    });
  },
};

// AI Generation API
export const aiAPI = {
  // Generate story with OpenAI
  generateStory: async (storyData: {
    theme: string;
    art_style: string;
    character_name?: string;
    character_age?: number;
    character_gender?: string;
    target_age?: string;
  }) => {
    return makeAuthenticatedRequest('/ai/generate-story', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  },

  // Generate storybook with progress updates
  generateStorybookWithProgress: async (storyData: {
    theme: string;
    art_style: string;
    character_name?: string;
    character_age?: number;
    character_gender?: string;
    target_age?: string;
  }, onProgress: (data: any) => void) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token not found');

    const response = await fetch(`${API_BASE_URL}/ai/generate-storybook-with-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(storyData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onProgress(data);
          } catch (parseError) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    }
  },

  // Download storybook PDF
  downloadStorybook: async (storybookId: string, storyData?: {
    theme: string;
    art_style: string;
    character_name?: string;
    character_age?: number;
    character_gender?: string;
    target_age?: string;
  }) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token not found');
    
    // Build query string with story parameters
    const params = new URLSearchParams();
    if (storyData) {
      if (storyData.theme) params.append('theme', storyData.theme);
      if (storyData.art_style) params.append('art_style', storyData.art_style);
      if (storyData.character_name) params.append('character_name', storyData.character_name);
      if (storyData.character_age) params.append('character_age', storyData.character_age.toString());
      if (storyData.character_gender) params.append('character_gender', storyData.character_gender);
      if (storyData.target_age) params.append('target_age', storyData.target_age);
    }
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/ai/download-storybook/${storybookId}${queryString ? '?' + queryString : ''}`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to download storybook');
    }

    return response.blob();
  },

  // Generate illustration with Replicate
  generateIllustration: async (illustrationData: {
    story_id: string;
    chapter_id?: string;
    prompt: string;
    art_style: string;
  }) => {
    return makeAuthenticatedRequest('/ai/generate-illustration', {
      method: 'POST',
      body: JSON.stringify(illustrationData),
    });
  },

  // Check illustration generation status
  checkIllustrationStatus: async (predictionId: string) => {
    return makeAuthenticatedRequest(`/ai/illustration-status/${predictionId}`);
  },
};

// Chapters API
export const chaptersAPI = {
  // Create chapter
  create: async (chapterData: {
    story_id: string;
    chapter_number: number;
    title: string;
    content: string;
  }) => {
    return makeAuthenticatedRequest('/chapters', {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  },

  // Get chapters for a story
  getByStory: async (storyId: string) => {
    return makeAuthenticatedRequest(`/chapters/story/${storyId}`);
  },

  // Get specific chapter
  getById: async (chapterId: string) => {
    return makeAuthenticatedRequest(`/chapters/${chapterId}`);
  },

  // Update chapter
  update: async (chapterId: string, updates: any) => {
    return makeAuthenticatedRequest(`/chapters/${chapterId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete chapter
  delete: async (chapterId: string) => {
    return makeAuthenticatedRequest(`/chapters/${chapterId}`, {
      method: 'DELETE',
    });
  },
};

// Illustrations API
export const illustrationsAPI = {
  // Get illustrations for a story
  getByStory: async (storyId: string) => {
    return makeAuthenticatedRequest(`/illustrations/story/${storyId}`);
  },

  // Get specific illustration
  getById: async (illustrationId: string) => {
    return makeAuthenticatedRequest(`/illustrations/${illustrationId}`);
  },

  // Regenerate illustration
  regenerate: async (illustrationId: string) => {
    return makeAuthenticatedRequest(`/illustrations/regenerate/${illustrationId}`, {
      method: 'POST',
    });
  },

  // Delete illustration
  delete: async (illustrationId: string) => {
    return makeAuthenticatedRequest(`/illustrations/${illustrationId}`, {
      method: 'DELETE',
    });
  },
};

// PDFs API
export const pdfsAPI = {
  // Generate PDF for story
  generate: async (storyId: string) => {
    return makeAuthenticatedRequest('/pdfs/generate', {
      method: 'POST',
      body: JSON.stringify({ story_id: storyId }),
    });
  },

  // Get PDFs for a story
  getByStory: async (storyId: string) => {
    return makeAuthenticatedRequest(`/pdfs/story/${storyId}`);
  },

  // Download PDF
  download: async (pdfId: string) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token not found');
    
    const response = await fetch(`${API_BASE_URL}/pdfs/download/${pdfId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }

    return response.blob();
  },
};

// Users API
export const usersAPI = {
  // Get user dashboard
  getDashboard: async () => {
    return makeAuthenticatedRequest('/users/dashboard');
  },

  // Get user favorites
  getFavorites: async () => {
    return makeAuthenticatedRequest('/users/favorites');
  },

  // Add to favorites
  addToFavorites: async (storyId: string) => {
    return makeAuthenticatedRequest(`/users/favorites/${storyId}`, {
      method: 'POST',
    });
  },

  // Remove from favorites
  removeFromFavorites: async (storyId: string) => {
    return makeAuthenticatedRequest(`/users/favorites/${storyId}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch('http://localhost:8000/health');
    return response.ok;
  } catch (error) {
    return false;
  }
};
