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
