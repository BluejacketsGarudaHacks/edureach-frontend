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

export const joinCommunity = async (communityId: string, userId: string, token: string): Promise<Community | null> => {
    if (token == null) return null;
    if (userId == "") return null;
    const data = {
        communityId: communityId,
        memberId: userId
    };

    return api.post("community/add-member", data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}