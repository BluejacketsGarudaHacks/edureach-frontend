"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { login, loginInputSchema, type loginInput } from "../api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import Logo from "~/components/logo";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  let form = useForm<loginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const handleSubmit = async (data: loginInput) => {
    try {
      let response = await login({ data });
      localStorage.setItem('token', response.data);
      toast("Berhasil masuk");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast("Gagal masuk. " + error.response.statusText);
        }
      }
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
      <Toaster />
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Logo />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EduReach
          </span>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Selamat Datang Kembali
        </CardTitle>
        <CardDescription className="text-gray-600">
          Masuk ke akun EduReach Anda untuk melanjutkan pembelajaran
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            action=""
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Email</Label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="john@edureach.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Masukkan password.."
                          {...field}
                          type={showPassword ? "" : "password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">Ingat saya</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              Masuk
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{" "}
            <a
              href="/auth/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Daftar sekarang
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
