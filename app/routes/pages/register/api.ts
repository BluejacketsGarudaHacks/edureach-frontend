import z from "zod";
import { api } from "~/util/apiClient";

export const registerInputSchema = z.object({
  firstName: z.string().min(1, "Nama depan tidak boleh kosong"),
  lastName: z.string().min(1, "Nama belakang tidak boleh kosong"),
  email: z.string().min(1, "Email tidak boleh kosong.").refine(
    e => e.includes("@") && e.endsWith(".com")
    , "Email harus dalam format [nama]@[domain].com"),
  password: z.string().min(6, "Password harus lebih dari 6 karakter"),
  confirmPassword: z.string(),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal lahir tidak valid",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama dengan password konfirmasi",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const register = async ({data}:{data: RegisterInput}):Promise<string> => {
    return api.post('/register', data)
}
