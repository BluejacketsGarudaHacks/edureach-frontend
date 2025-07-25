import type { Community } from "~/interfaces/community";
import { api } from "~/util/apiClient";

export interface ICreateSchedule {
  communityId: string;
  scheduleTime: Date;
}

export interface Schedule {
  id: string;
  scheduleTime: string;
  volunteerId: string;
  communityId: string;
}

export const getCommunity = ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<Community> => {
  return api.get(`community/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export async function createSchedule(
  createSchedule: ICreateSchedule,
  token: string
) {
  return api.post("schedule", createSchedule, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getSchedules(token: string) {
  return api.get("schedule", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteSchedule(id: string, token: string) {
  return api.delete(`schedule/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
