import { z } from "zod"
import { api } from "~/util/apiClient"
 
export const loginInputSchema = z.object({
  email: z.string().min(1, "Email tidak boleh kosong.").refine(
    e => e.includes("@") && e.endsWith(".com")
    , "Email harus dalam format [nama]@[domain].com"),
  password: z.string().min(6, "Password harus lebih dari 6 karakter."),
})

export type loginInput = z.infer  <typeof loginInputSchema>
 
export const login = async ({data}:{data: loginInput}):Promise<string> => {
    return api.post('/login', data)
}
