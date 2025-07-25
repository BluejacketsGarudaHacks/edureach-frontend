"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios"
import { toast, Toaster } from "sonner"
import { useNavigate } from "react-router"
import type { Route } from "./+types/page"
import { getCurrentUser } from "../home/api"
import { changePassword, updateUser, type changePasswordInput, type updateUserInput } from "./api"
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Upload,
  User,
  Mail,
  Calendar,
  Lock,
  Camera,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthGuard } from "~/lib/auth-middleware";
import Loading from "~/components/ui/loading";

export async function clientLoader() {
  const token = window.localStorage.getItem("token")
  if (!token){
    return null
  }
  const product = await getCurrentUser(token)
  return product;
}


export function HydrateFallback() {
  return <Loading />;
}

export default function EditProfilePage({loaderData}:Route.ComponentProps) {
  const { isAuthenticated } = useAuthGuard();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [currentFile, setCurrentFile] = useState<File>()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    window.document.title = "Profil | EduReach";
  }, []);

  let user = loaderData

  const navigate = useNavigate()
  if (!isAuthenticated() || !user) {
    return null;
  }

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<updateUserInput>({
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      dateOfBirth: user.dob,
    },
  })
  const [selectedImage, setSelectedImage] = useState<string>(`${import.meta.env.VITE_BACKEND_URL}${user.imagePath}`)

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPassword,
  } = useForm<changePasswordInput>()

  const newPassword = watchPassword("newPassword");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      setCurrentFile(file)
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (data: updateUserInput) => {
    setIsSubmitting(true)
    
    const token = window.localStorage.getItem("token")
    if (!token){
      toast("Anda tidak diperbolehkan untuk mengubah profil anda")
      return
    }
    try {
      await updateUser({data, token, image: currentFile})
      toast("Profil berhasil diubah")
      
    } catch (error) {
      if (axios.isAxiosError(error)){
        toast("Profil gagal diubah")
        setIsSubmitting(false)
        return
      }
    }    
    
    setIsSubmitting(false)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  const onSubmitPassword = async (data: changePasswordInput) => {
    setIsPasswordSubmitting(true)

    const token = window.localStorage.getItem("token")
    if (!token){
      toast("Anda tidak diperbolehkan untuk mengganti password anda")
      return
    }
    try {
      await changePassword({data, token})
      toast("password berhasil diganti")
    } catch (error) {
      if (axios.isAxiosError(error)){
        toast("password gagal diganti")
        return
      }
    }  

    setIsPasswordSubmitting(false);
    setIsPasswordSuccess(true);
    resetPassword();

    setTimeout(() => {
      setIsPasswordSuccess(false);
      setIsPasswordModalOpen(false);
    }, 2000);
  };

  const handleGoBack = () => {

    navigate("/home")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke beranda
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduReach
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ubah Profil
          </h1>
          <p className="text-gray-600">
            Ubah informasi personal dan pengaturan akun.
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />

            <AlertDescription className="text-green-800">Profile anda berhasil diperbaharui!</AlertDescription>

          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informasi personal</span>
                </CardTitle>
                <CardDescription>
                  Perbarui informasi pribadi dan foto profil Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmitProfile(onSubmitProfile)}
                  className="space-y-6"
                >
                  {/* Profile Picture */}
                  <div className="space-y-4">
                    <Label className="flex items-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Foto Profil</span>
                    </Label>
                    <div className="flex items-center space-x-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={selectedImage || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-lg">JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          {...registerProfile("image")}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Label htmlFor="image" className="cursor-pointer">

                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Ubah Foto
                            </span>
                          </Button>
                        </Label>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG / GIF. Ukuran maksimal 50 MegaByte (MB).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Nama lengkap *</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      {...registerProfile("fullName", {
                        required: "Nama lengkap harus ada",
                        minLength: {
                          value: 1,
                          message: "Nama lengkap minimal 1 karakter",
                        },
                        maxLength: {
                          value: 50,
                          message: "Nama lengkap maksimal 50 karakter",
                        },
                      })}
                      className={profileErrors.fullName ? "border-red-500" : ""}
                    />
                    {profileErrors.fullName && (
                      <p className="text-sm text-red-600">
                        {profileErrors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email *</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@edureach.com"
                      {...registerProfile("email", {
                        required: "Email harus ada",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Alamat email tidak sesuai",
                        },
                      })}
                      className={profileErrors.email ? "border-red-500" : ""}
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-red-600">
                        {profileErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="dateOfBirth"
                      className="flex items-center space-x-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Tanggal Lahir *</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...registerProfile("dateOfBirth", {
                        required: "Tanggal lahir harus ada",
                        validate: (value) => {
                          const today = new Date();
                          const birthDate = new Date(value);
                          const age =
                            today.getFullYear() - birthDate.getFullYear();
                          if (age < 13)
                            return "Anda harus minimal berumur 13 tahun";
                          if (age > 120)
                            return "Umur tidak valid";
                          return true;
                        },
                      })}
                      className={
                        profileErrors.dateOfBirth ? "border-red-500" : ""
                      }
                    />
                    {profileErrors.dateOfBirth && (
                      <p className="text-sm text-red-600">
                        {profileErrors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Mengubah Profil...
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          Ubah Profil
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Keamanan</CardTitle>
                <CardDescription>
                  Kelola keamanan akun dan password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog
                  open={isPasswordModalOpen}
                  onOpenChange={setIsPasswordModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Lock className="w-4 h-4 mr-2" />
                      Ganti Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ganti Password</DialogTitle>
                      <DialogDescription>
                        Masukkan password saat ini dan memilih password baru yang aman.
                      </DialogDescription>
                    </DialogHeader>

                    {isPasswordSuccess && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Password berhasil diganti!
                        </AlertDescription>
                      </Alert>
                    )}

                    <form
                      onSubmit={handleSubmitPassword(onSubmitPassword)}
                      className="space-y-4"
                    >
                      {/* Current Password */}
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Password aaat ini*
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            {...registerPassword("currentPassword", {
                              required: "Password saat ini harus ada",
                            })}
                            className={
                              passwordErrors.currentPassword
                                ? "border-red-500 pr-10"
                                : "pr-10"
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-red-600">
                            {passwordErrors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Password baru *</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Masukkan password baru"
                            {...registerPassword("newPassword", {
                              required: "Password baru harus ada",
                              minLength: {
                                value: 8,
                                message:
                                  "Password baru minimal 8 karakter",
                              },
                              pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]+$/,
                                message: "Password harus memiliki huruf, simbol, dan angka",
                              },
                            })}
                            className={
                              passwordErrors.newPassword
                                ? "border-red-500 pr-10"
                                : "pr-10"
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-red-600">
                            {passwordErrors.newPassword.message}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Konfirmasi Password Baru *
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Konfirmasi Password Baru"
                            {...registerPassword("confirmPassword", {
                              required: "Tolong konfirmasi password anda",
                            })}
                            className={
                              passwordErrors.confirmPassword
                                ? "border-red-500 pr-10"
                                : "pr-10"
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-red-600">
                            {passwordErrors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPasswordModalOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isPasswordSubmitting}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {isPasswordSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Mengganti...
                            </>
                          ) : (
                            "Ganti Password"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Syarat Password:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Minimal 8 karakter</li>
                    <li>• Minimal memiliki 1 angka</li>
                    <li>• Minimal memiliki 1 huruf</li>
                    <li>• Minimal memiliki 1 simbol</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <User className="w-4 h-4" />
              <AlertDescription>
                Informasi profile anda terlihat ke anggota komunitas lainnya.
                Pastikan untuk memastikan profilenya adalah yang terbaru.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  );
}
