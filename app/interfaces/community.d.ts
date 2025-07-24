import type { User } from "./user";
import type { Location } from "./location";

export interface Community {
    id: string;
    name: string;
    description: string;
    locationId: string;
    imagePath: string;
    location: Location;
    members: Member[];
    isJoined: boolean;
    volunteers: Member[];
}

interface Member {
    userId: string;
    user: User;
}