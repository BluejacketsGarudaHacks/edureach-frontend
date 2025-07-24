import z from "zod";
import { api } from "~/util/apiClient";

export const createCommunityInputSchema = z.object({
  name: z.string().min(1, "Nama komunitas tidak boleh kosong."),
  description: z.string().min(1, "Deskripsi komunitas tidak boleh kosong."),
  locationid: z.string().min(1, "lokasi tidak boleh kosong."),
  image: z.instanceof(File),
})

export type createCommunityInput = z.infer<typeof createCommunityInputSchema>

export const createCommunity = ({data}:{data:createCommunityInput}) => {
    let formData = new FormData();
    formData.append('name', data.name)
    formData.append('description', data.name)
    formData.append('locationId', data.locationid)
    formData.append('image', data.image)

    
    return api.post('community', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}