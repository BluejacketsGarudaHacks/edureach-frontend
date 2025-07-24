import z from "zod";
import { api } from "~/util/apiClient";

export const registerInputSchema = z.object({
  firstName: z.string().min(1, "Nama depan tidak boleh kosong"),
  lastName: z.string(),
  email: z.string().min(1, "Email tidak boleh kosong.").refine(
    e => e.includes("@") && e.endsWith(".com")
    , "Email harus dalam format [nama]@[domain].com"),
  password: z.string().min(8, "Password harus minimal 8 karakter"),
  confirmPassword: z.string(),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal lahir tidak valid",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama dengan konfirmasi password",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const register = async ({data}:{data: RegisterInput}):Promise<string> => {
    return api.post('user/register', data)
}
