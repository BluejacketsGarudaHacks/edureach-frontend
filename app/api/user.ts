import { api } from "~/util/apiClient";
import type { User } from "~/interfaces/user";

export const getUserProfile = async (token: string): Promise<User> => {
  const response = await api.get("user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
