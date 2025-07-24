import z from "zod";
import { api } from "~/util/apiClient";

export const changePasswordInputSchema = z.object({
    currentPassword: z.string().min(8, "Password harus lebih dari 8 karakter"),
    newPassword: z.string().min(8, "Password harus lebih dari 8 karakter"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak sama dengan password konfirmasi",
  path: ["confirmPassword"],
});

export const updateUserInputSchema = z.object({
  fullName: z.string().min(1, "Nama tidak boleh kosong"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal lahir tidak valid",
  }),
  email: z.string().min(1, "Email tidak boleh kosong.").refine(
      e => e.includes("@") && e.endsWith(".com")
      , "Email harus dalam format [nama]@[domain].com"),
  image: z.instanceof(File)
})

export type updateUserInput = z.infer<typeof updateUserInputSchema>
export type changePasswordInput = z.infer<typeof changePasswordInputSchema>

export const updateUser = ({data, token}:{data:updateUserInput, token: string}) => {
    const formData = new FormData()

    formData.append("FirstName", data.fullName.split(' ')[0])
    formData.append("LastName", data.fullName.split(' ').length < 2 ? '': data.fullName.split(' ')[1])
    formData.append("DateOfBirth", data.dateOfBirth)
    formData.append("Email", data.email)
    formData.append("Image", data.image)

    return api.put("user", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const changePassword = ({data, token}:{data:changePasswordInput, token: string}) => {
    return api.put("user/password", {
        password: data.newPassword,
        confirmPassword: data.confirmPassword
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}
