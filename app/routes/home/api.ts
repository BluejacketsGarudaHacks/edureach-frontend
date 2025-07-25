import type { Community } from "~/interfaces/community";
import type { User } from "~/interfaces/user";
import { api } from "~/util/apiClient";

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isShown: boolean;
}

export interface NotificationRequest {
  message: string;
  isShown: boolean;
  isChecked: boolean;
}

export const getCurrentUser = async (token: string): Promise<User | null> => {
  if (token == null) return null;

  console.log(token);
  return api.get("user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export async function getNotifications(token: string) {
  const notifications = await api.get("user/notification/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return notifications as unknown as Notification[];
}

export async function updateNotification(
  notification: Notification,
  token: string
) {
  const request: NotificationRequest = {
    message: notification.message,
    isShown: true,
    isChecked: false,
  };

  await api.put(`user/update-notification/${notification.id}`, request, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getUserCommunities = async (token: string, userId: string): Promise<Community[]> => {
  if (token == null) return [];

  if (userId == "") return [];

  return api.get("community/user/" + userId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
