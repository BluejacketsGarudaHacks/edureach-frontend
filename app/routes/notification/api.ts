import { api } from "~/util/apiClient";

export interface Notification {
    id: string;
    userId: string;
    message: string;
    isShown: boolean;
    isChecked: boolean;
    createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const token = window.localStorage.getItem("token")

    try {    
        const notifications = await api.get<Notification[]>("user/notification/user", { 
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return notifications;
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        throw error;
    }
};

export const checkNotification = async(notification: Notification): Promise<void> => {
    const token = window.localStorage.getItem("token")
    notification.isChecked = true;

    try {
        const response = await api.put<Notification[]>(`user/update-notification/${notification.id}`, notification, { 
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log(response);
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        throw error;
    }
}