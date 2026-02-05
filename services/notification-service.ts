import { createClient } from '@/lib/supabase/client';
// import { RealtimeChannel } from '@supabase/supabase-js'; // REMOVED

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    content: string;
    read: boolean;
    data?: any;
    created_at: string;
    action_url?: string;
}

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    in_app: boolean;
    marketing: boolean;
    security: boolean;
}

type NotificationEvent = 'notification:new' | 'notification:updated' | 'notification:navigate';

export class NotificationService {
    private supabase = createClient();
    private channel: any | null = null;
    private listeners: Map<string, Function[]> = new Map();

    constructor() {
        this.listeners.set('notification:new', []);
        this.listeners.set('notification:updated', []);
        this.listeners.set('notification:navigate', []);
    }

    async getNotifications(userId: string, options: { limit?: number; offset?: number } = {}) {
        const { limit = 20, offset = 0 } = options;

        const { data, count, error } = await this.supabase
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return {
            notifications: data as Notification[],
            total: count || 0
        };
    }

    async getUnreadCount(userId: string): Promise<number> {
        const { count, error } = await this.supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
        return count || 0;
    }

    async getNotificationSettings(userId: string): Promise<NotificationSettings> {
        const { data, error } = await this.supabase
            .from('notification_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return data || {
            email: true,
            push: true,
            in_app: true,
            marketing: false,
            security: true
        };
    }

    async updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<void> {
        const { error } = await this.supabase
            .from('notification_settings')
            .upsert({ user_id: userId, ...settings });

        if (error) throw error;
    }

    async markAsRead(notificationId: string): Promise<void> {
        const { error } = await this.supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        if (error) throw error;
    }

    async markAllAsRead(userId: string): Promise<void> {
        const { error } = await this.supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
    }

    async deleteNotification(notificationId: string): Promise<void> {
        const { error } = await this.supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);

        if (error) throw error;
    }

    async initializeRealtimeNotifications(userId: string): Promise<void> {
        if (this.channel) return;

        this.channel = this.supabase
            .channel(`notifications:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                (payload: any) => {
                    if (payload.eventType === 'INSERT') {
                        this.emit('notification:new', payload.new as Notification);
                    } else if (payload.eventType === 'UPDATE') {
                        this.emit('notification:updated', payload.new as Notification);
                    }
                }
            )
            .subscribe();
    }

    stopRealtimeNotifications(): void {
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
        }
    }

    addEventListener(event: NotificationEvent, callback: Function): void {
        const callbacks = this.listeners.get(event) || [];
        callbacks.push(callback);
        this.listeners.set(event, callbacks);
    }

    private emit(event: NotificationEvent, data: any): void {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(data));
    }

    async requestNotificationPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) return 'denied';
        return await Notification.requestPermission();
    }
}
