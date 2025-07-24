import { z } from "zod"
import { api } from "~/util/apiClient"
 
export const loginInputSchema = z.object({
  email: z.string().min(1, "Email cant be empty.").refine(e => e.includes("@") && e.endsWith(".com")),
  password: z.string().min(6, "Password cant be less than 6 characters."),
})

export type loginInput = z.infer  <typeof loginInputSchema>
 
export const login = async ({data}:{data: loginInput}):Promise<string> => {
    return api.post('/login', data)
}
