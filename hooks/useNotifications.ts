'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { NotificationService, Notification, NotificationSettings } from '@/lib/services/notification-service';

interface UseNotificationsOptions {
  instructorId?: string;
  autoMarkAsRead?: boolean;
  enableRealtime?: boolean;
  pollInterval?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  settings: NotificationSettings | null;
  hasMore: boolean;
  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  updateSettings: (settings: NotificationSettings) => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
  // Event handlers
  onNavigate: (callback: (route: string, notification: Notification) => void) => void;
  onNewNotification: (callback: (notification: Notification) => void) => void;
}

const NOTIFICATIONS_PER_PAGE = 20;

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    instructorId,
    autoMarkAsRead = false,
    enableRealtime = true,
    pollInterval = 30000 // 30 seconds
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  const notificationService = useRef<NotificationService>();
  const navigationCallback = useRef<((route: string, notification: Notification) => void) | null>(null);
  const newNotificationCallback = useRef<((notification: Notification) => void) | null>(null);
  const pollInterval_ref = useRef<NodeJS.Timeout | null>(null);

  // Initialize notification service
  useEffect(() => {
    notificationService.current = new NotificationService();
    
    return () => {
      if (notificationService.current) {
        notificationService.current.stopRealtimeNotifications();
      }
      if (pollInterval_ref.current) {
        clearInterval(pollInterval_ref.current);
      }
    };
  }, []);

  // Setup realtime notifications
  useEffect(() => {
    if (!instructorId || !notificationService.current || !enableRealtime) return;

    const setupRealtime = async () => {
      try {
        await notificationService.current!.initializeRealtimeNotifications(instructorId);

        // Setup event listeners
        notificationService.current!.addEventListener('notification:new', (notification: Notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          if (newNotificationCallback.current) {
            newNotificationCallback.current(notification);
          }
        });

        notificationService.current!.addEventListener('notification:updated', (notification: Notification) => {
          setNotifications(prev => prev.map(n => n.id === notification.id ? notification : n));
          
          if (notification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        });

        notificationService.current!.addEventListener('notification:navigate', ({ route, notification }) => {
          if (navigationCallback.current) {
            navigationCallback.current(route, notification);
          }
        });

      } catch (error) {
        console.error('Failed to setup realtime notifications:', error);
        setError('Failed to setup real-time notifications');
      }
    };

    setupRealtime();

    return () => {
      if (notificationService.current) {
        notificationService.current.stopRealtimeNotifications();
      }
    };
  }, [instructorId, enableRealtime]);

  // Setup polling as fallback
  useEffect(() => {
    if (!instructorId || !pollInterval || enableRealtime) return;

    pollInterval_ref.current = setInterval(() => {
      fetchNotifications(true);
    }, pollInterval);

    return () => {
      if (pollInterval_ref.current) {
        clearInterval(pollInterval_ref.current);
      }
    };
  }, [instructorId, pollInterval, enableRealtime]);

  // Fetch initial data
  useEffect(() => {
    if (instructorId) {
      fetchNotifications();
      fetchUnreadCount();
      fetchSettings();
    }
  }, [instructorId]);

  const fetchNotifications = useCallback(async (reset = false) => {
    if (!instructorId || !notificationService.current) return;

    try {
      if (reset) {
        setLoading(true);
        setPage(0);
      }

      const currentPage = reset ? 0 : page;
      const { notifications: newNotifications, total } = await notificationService.current.getNotifications(
        instructorId,
        {
          limit: NOTIFICATIONS_PER_PAGE,
          offset: currentPage * NOTIFICATIONS_PER_PAGE
        }
      );

      if (reset) {
        setNotifications(newNotifications);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
      }

      setHasMore(newNotifications.length === NOTIFICATIONS_PER_PAGE && (currentPage + 1) * NOTIFICATIONS_PER_PAGE < total);
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [instructorId, page]);

  const fetchUnreadCount = useCallback(async () => {
    if (!instructorId || !notificationService.current) return;

    try {
      const count = await notificationService.current.getUnreadCount(instructorId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [instructorId]);

  const fetchSettings = useCallback(async () => {
    if (!instructorId || !notificationService.current) return;

    try {
      const settings = await notificationService.current.getNotificationSettings(instructorId);
      setSettings(settings);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  }, [instructorId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!notificationService.current) return;

    try {
      await notificationService.current.markAsRead(notificationId);
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark notification as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!instructorId || !notificationService.current) return;

    try {
      await notificationService.current.markAllAsRead(instructorId);
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError('Failed to mark all notifications as read');
    }
  }, [instructorId]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!notificationService.current) return;

    try {
      await notificationService.current.deleteNotification(notificationId);
      
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification');
    }
  }, [notifications]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setPage(prev => prev + 1);
    await fetchNotifications();
  }, [hasMore, loading, fetchNotifications]);

  const refresh = useCallback(async () => {
    await fetchNotifications(true);
    await fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const updateSettings = useCallback(async (newSettings: NotificationSettings) => {
    if (!instructorId || !notificationService.current) return;

    try {
      await notificationService.current.updateNotificationSettings(instructorId, newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setError('Failed to update notification settings');
      throw error;
    }
  }, [instructorId]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!notificationService.current) return 'denied';

    try {
      return await notificationService.current.requestNotificationPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }, []);

  const onNavigate = useCallback((callback: (route: string, notification: Notification) => void) => {
    navigationCallback.current = callback;
  }, []);

  const onNewNotification = useCallback((callback: (notification: Notification) => void) => {
    newNotificationCallback.current = callback;
  }, []);

  // Auto-mark as read when viewing notifications
  useEffect(() => {
    if (autoMarkAsRead && notifications.length > 0) {
      const unreadNotifications = notifications.filter(n => !n.read);
      unreadNotifications.forEach(notification => {
        setTimeout(() => markAsRead(notification.id), 2000); // Mark as read after 2 seconds
      });
    }
  }, [notifications, autoMarkAsRead, markAsRead]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    settings,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh,
    updateSettings,
    requestPermission,
    onNavigate,
    onNewNotification
  };
}