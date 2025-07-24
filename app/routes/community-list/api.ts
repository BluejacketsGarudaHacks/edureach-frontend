import type { Community } from "~/interfaces/community";
import type { Location } from "~/interfaces/location";
import { api } from "~/util/apiClient";

export const getLocations = async (token: string): Promise<Location[]> => {
    if (token == null) return [];

    return api.get("location", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const getCommunities = async (token: string): Promise<Community[]> => {
    if (token == null) return [];
    
    return api.get("community", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}