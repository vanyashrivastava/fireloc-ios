import { useState, useEffect, useCallback } from 'react';
import { getActiveFires, getRecentAlerts, markAlertAsRead } from '../services/fireApi';

/**
 * Custom hook to manage fire data and alerts
 * Automatically fetches data on an interval
 */
export const useFireData = (refreshInterval = 10000) => {
  const [fires, setFires] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Calculate unread alert count
  const unreadCount = alerts.filter((a) => !a.read).length;
  const activeFireCount = fires.length;

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [firesData, alertsData] = await Promise.all([
        getActiveFires(),
        getRecentAlerts(),
      ]);
      setFires(firesData);
      setAlerts(alertsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching fire data:', err);
      setError(err.message || 'Failed to fetch fire data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up interval for auto-refresh
  useEffect(() => {
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  // Handle marking alert as read
  const handleAlertRead = useCallback(
    async (alertId) => {
      try {
        await markAlertAsRead(alertId);
        setAlerts((prevAlerts) =>
          prevAlerts.map((alert) =>
            alert.id === alertId ? { ...alert, read: true } : alert
          )
        );
      } catch (err) {
        console.error('Error marking alert as read:', err);
      }
    },
    []
  );

  return {
    fires,
    alerts,
    loading,
    error,
    lastUpdated,
    unreadCount,
    activeFireCount,
    refetch: fetchData,
    handleAlertRead,
  };
};

export default useFireData;
