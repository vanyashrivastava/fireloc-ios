import axios from 'axios';

// Placeholder backend URL - replace with actual endpoint
const API_BASE_URL = 'https://api.fireloc.local';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Fetch active fires from backend
 * @returns {Promise<Array>} Array of fire objects with lat, long, timestamp, id
 */
export const getActiveFires = async () => {
  try {
    // Mock data for development
    const mockFires = [
      {
        id: 'fire-1',
        latitude: 34.05,
        longitude: -118.25,
        timestamp: new Date().toISOString(),
        confidence: 0.98,
      },
      {
        id: 'fire-2',
        latitude: 34.08,
        longitude: -118.22,
        timestamp: new Date(Date.now() - 60000).toISOString(),
        confidence: 0.92,
      },
      {
        id: 'fire-3',
        latitude: 34.02,
        longitude: -118.28,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        confidence: 0.88,
      },
    ];

    // Uncomment when backend is ready:
    // const response = await apiClient.get('/active-fires');
    // return response.data;

    return mockFires;
  } catch (error) {
    console.error('Error fetching active fires:', error.message);
    throw error;
  }
};

/**
 * Fetch recent alerts
 * @returns {Promise<Array>} Array of alert objects
 */
export const getRecentAlerts = async () => {
  try {
    // Mock data for development
    const mockAlerts = [
      {
        id: 'alert-1',
        fireId: 'fire-1',
        message: 'Fire detected at 34.05°N, 118.25°W',
        latitude: 34.05,
        longitude: -118.25,
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: 'alert-2',
        fireId: 'fire-2',
        message: 'Fire detected at 34.08°N, 118.22°W',
        latitude: 34.08,
        longitude: -118.22,
        timestamp: new Date(Date.now() - 120000).toISOString(),
        read: false,
      },
      {
        id: 'alert-3',
        fireId: 'fire-3',
        message: 'Fire detected at 34.02°N, 118.28°W',
        latitude: 34.02,
        longitude: -118.28,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        read: true,
      },
    ];

    // Uncomment when backend is ready:
    // const response = await apiClient.get('/recent-alerts');
    // return response.data;

    return mockAlerts;
  } catch (error) {
    console.error('Error fetching recent alerts:', error.message);
    throw error;
  }
};

/**
 * Mark an alert as read
 * @param {string} alertId - The alert ID
 * @returns {Promise<Object>} Updated alert object
 */
export const markAlertAsRead = async (alertId) => {
  try {
    // Mock implementation
    console.log(`Marking alert ${alertId} as read`);

    // Uncomment when backend is ready:
    // const response = await apiClient.post(`/alerts/${alertId}/read`);
    // return response.data;

    return { id: alertId, read: true };
  } catch (error) {
    console.error(`Error marking alert ${alertId} as read:`, error.message);
    throw error;
  }
};

/**
 * Mark a fire as viewed
 * @param {string} fireId - The fire ID
 * @returns {Promise<Object>} Updated fire object
 */
export const markFireAsViewed = async (fireId) => {
  try {
    console.log(`Marking fire ${fireId} as viewed`);

    // Uncomment when backend is ready:
    // const response = await apiClient.post(`/fires/${fireId}/viewed`);
    // return response.data;

    return { id: fireId, viewed: true };
  } catch (error) {
    console.error(`Error marking fire ${fireId} as viewed:`, error.message);
    throw error;
  }
};

export default {
  getActiveFires,
  getRecentAlerts,
  markAlertAsRead,
  markFireAsViewed,
};
