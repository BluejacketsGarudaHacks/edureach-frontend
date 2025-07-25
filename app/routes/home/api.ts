import type { Community } from "~/interfaces/community";
import type { User } from "~/interfaces/user";
import { api } from "~/util/apiClient";

export const getCurrentUser = async (token: string): Promise<User | null> => {
  if (token == null) return null;

  return api.get("user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserCommunities = async (token: string, userId: string): Promise<Community[]> => {
  if (token == null) return [];

  if (userId == "") return [];

  return api.get("community/user/" + userId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};