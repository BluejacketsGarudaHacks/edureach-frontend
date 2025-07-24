"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Eye, EyeOff, Calendar } from "lucide-react"
import Logo from "~/components/logo"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { register, registerInputSchema, type RegisterInput } from "../api"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form"
import { toast, Toaster } from "sonner"
import axios from "axios"
import { useNavigate } from "react-router"


export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    let form = useForm<RegisterInput>({
        resolver: zodResolver(registerInputSchema),
        defaultValues: {
            firstName:"",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            dateOfBirth: ""
        }
    })
  const navigate = useNavigate()

  const handleSubmit = async (data:RegisterInput) => {
      try {
        let response = await register({data})
        
        toast("Pendaftaran berhasil.")
        setTimeout(() => {
            navigate("/auth/login")
        }, 3000);
    } catch (error) {
        if (axios.isAxiosError(error)){
            toast("Pendaftaran gagal. " + error.message)
        }
    }
  }


  return (
    <Card className="w-full max-w-md shadow-xl border-0">
        <Toaster />
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Logo />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EduReach
          </span>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Bergabung dengan EduReach</CardTitle>
        <CardDescription className="text-gray-600">
          Buat akun untuk memulai perjalanan pembelajaran Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Nama Depan</Label>
                    <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="John" id ="firstName" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="space-y-2">
                <Label htmlFor="lastName">Nama Belakang</Label>
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Doe" id ="lastName" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Masukkan email.." id ="email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                <div className="relative">
                
                <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="flex justify-between">
                                <Input
                                    id="dateOfBirth"
                                    placeholder="Masukkan tanggal lahir.."
                                    type="date"
                                    className="h-11 pr-10"
                                    {...field}
                                />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <FormField
                        control={form.control}
                        name="password"
                        
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <div className="relative">
                                <Input placeholder="Masukkan password.." {...field} type={showPassword?"":"password"}/>
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <div className="relative">
                                <Input placeholder="Masukkan password konfirmasi disini" {...field} type={showConfirmPassword?"":"password"}/>
                                <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-600">Daftar sebagai volunteer</span>
                </label>
            </div>

            <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
                Daftar Sekarang
            </Button>
            </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?{" "}
            <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Masuk di sini
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
