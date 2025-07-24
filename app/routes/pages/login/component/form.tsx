"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import Logo from "~/components/logo"

export function Form() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Logo />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EduReach
          </span>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Selamat Datang Kembali</CardTitle>
        <CardDescription className="text-gray-600">
          Masuk ke akun EduReach Anda untuk melanjutkan pembelajaran
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password Anda"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-gray-600">Ingat saya</span>
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Lupa password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
          >
            Masuk
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{" "}
            <a href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Daftar sekarang
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
