import { api } from "~/util/apiClient"

export const getCommunity = ({id, token}:{id:string, token:string}) => {

    return api.get(`community/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

}