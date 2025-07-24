import type { Community } from "~/interfaces/community"
import { api } from "~/util/apiClient"

export const getCommunity = ({id, token}:{id:string, token:string}):Promise<Community> => {

    return api.get(`community/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

}