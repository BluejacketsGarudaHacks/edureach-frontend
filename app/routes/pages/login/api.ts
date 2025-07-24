import { z } from "zod";
import { api } from "~/util/apiClient";

export const loginInputSchema = z.object({
  email: z
    .string()
    .min(1, "Email tidak boleh kosong.")
    .refine(
      (e) => e.includes("@") && e.endsWith(".com"),
      "Email harus dalam format [nama]@[domain].com"
    ),
  password: z.string().min(8, "Password harus minimal 8 karakter."),
});

export type loginInput = z.infer<typeof loginInputSchema>;

interface LoginResponse {
  data: string;
}

export const login = async ({ data }: { data: loginInput }): Promise<LoginResponse> => {
  return api.post("user/login", data);
};
