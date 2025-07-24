"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Zap,
  Users,
  FileText,
  Plus,
  UserPlus,
  BookOpen,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "~/components/logo";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api";
import type { Route } from "./+types/page";
import { useAuthGuard } from "~/lib/auth-middleware";
import { useUser } from "~/hooks/useUser";

export default function HomePage() {
  useEffect(() => {
    window.document.title = "Home | EduReach";
  }, []);

  const { isAuthenticated, logout: authLogout } = useAuthGuard();
  const { user, setUser, clearUser } = useUser();
  const [profilePicture, setProfilePicture] = useState("");
  const [avatarFallback, setAvatarFallback] = useState("XX");

  const logout = () => {
    clearUser();
    authLogout();
  };

  if (!isAuthenticated()) {
    return null;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(token).then((user) => {
        if (user) {
          console.log(user);
          setUser(user);
          setProfilePicture(
            user.imagePath !== ""
              ? `${import.meta.env.VITE_BACKEND_URL}${user.imagePath}`
              : ""
          );
          setAvatarFallback(
            user.fullName
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "XX"
          );
        } else {
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Logo />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduReach
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Link to="/profile">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat datang, {user?.fullName}! 👋
          </h1>
          <p className="text-gray-600">
            Siap melanjutkan perjalanan Anda? Berikut yang bisa Anda lakukan
            hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Dokumen yang Diringkas
                  </p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Komunitas yang Diikuti
                  </p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">
                Summarizer AI Multibahasa
              </CardTitle>
              <CardDescription className="text-gray-600">
                Rangkum materi pembelajaran dalam bahasa Indonesia, Inggris,
                atau bahasa daerah dengan teknologi AI canggih.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">Bahasa Indonesia</Badge>
                <Badge variant="secondary">Bali</Badge>
                <Badge variant="secondary">Jawa</Badge>
                <Badge variant="secondary">Sunda</Badge>
                <Badge variant="secondary">Batak Toba</Badge>
                <Badge variant="secondary">Batak Karo</Badge>
                <Badge variant="secondary">Batak Simalungun</Badge>
                <Badge variant="secondary">Minang</Badge>
              </div>
              <Link to={"/summarizer"}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Ringkas Dokumen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">
                Komunitas Belajar
              </CardTitle>
              <CardDescription className="text-gray-600">
                Bergabung atau buat komunitas belajar untuk berbagi ilmu dan
                pengalaman dengan pendidik lain di Indonesia.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">Pengajaran Gratis</Badge>
                <Badge variant="secondary">Komunitas Aktif</Badge>
                <Badge variant="secondary">Sertifikasi</Badge>
                <Badge variant="secondary">Perluas Koneksi</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <Link to={"/community"}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Jelajahi Komunitas
                  </Button>
                </Link>
                <Link to="/create-community">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Komunitas Baru
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Komunitas Saya</CardTitle>
            <CardDescription>Komunitas yang telah Anda ikuti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Jakarta Teachers</h3>
                    <p className="text-sm text-gray-500">245 members</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  A community for educators in Jakarta to share resources and
                  collaborate.
                </p>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Math Enthusiasts</h3>
                    <p className="text-sm text-gray-500">89 members</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Sharing innovative math teaching methods and resources.
                </p>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Language Learning</h3>
                    <p className="text-sm text-gray-500">156 members</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Supporting multilingual education across Indonesia.
                </p>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
