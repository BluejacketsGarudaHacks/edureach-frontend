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
  Bell,
  Settings,
  LogOut,
  MapPin,
  UserCheck,
  Eye,
  Clock,
  Sparkles,
} from "lucide-react";
import Logo from "~/components/logo";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getNotifications,
  updateNotification,
  getUserCommunities,
  getUserSummary,
} from "./api";
import { useAuthGuard } from "~/lib/auth-middleware";
import { useUser } from "~/hooks/useUser";
import { toast } from "sonner";
import type { Community } from "~/interfaces/community";

interface UserSummary {
  id: string;
  userId: string;
  summaryTitle: string;
  summaryResult: string;
  createdAt?: string;
  language?: string;
}

export default function HomePage() {
  const { isAuthenticated, logout: authLogout } = useAuthGuard();
  const { user, setUser, clearUser } = useUser();
  const [profilePicture, setProfilePicture] = useState("");
  const [avatarFallback, setAvatarFallback] = useState("XX");
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true);
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [recentSummaries, setRecentSummaries] = useState<UserSummary[]>([]);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(true);

  useEffect(() => {
    window.document.title = "Home | EduReach";
  }, []);

  const logout = () => {
    clearUser();
    authLogout();
  };

  useEffect(() => {
    // Only fetch user data once when component mounts if user is not already loaded
    if (user) return; // User already exists, no need to fetch
    const authStatus = isAuthenticated();
    if (!authStatus) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    getCurrentUser(token)
      .then((fetchedUser) => {
        if (fetchedUser) {
          setUser(fetchedUser);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []); // Empty dependency array - only run once on mount

  // Separate effect for updating profile picture and avatar fallback when user changes
  useEffect(() => {
    setProfilePicture(
      user?.imagePath !== ""
        ? `${import.meta.env.VITE_BACKEND_URL}${user?.imagePath}`
        : ""
    );
    setAvatarFallback(
      user?.fullName
        ? user.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "XX"
    );
  }, [user]);

  useEffect(() => {
    if (user == null) return;
    const token = localStorage.getItem("token");
    if (token == null) return;
    getNotifications(token).then((result) => {
      for (const notif of result) {
        if (notif.isShown == false) {
          toast(notif.message);
          updateNotification(notif, token);
        }
      }
    });
  }, [user]);

  useEffect(() => {
    if (user == null) return;
    const token = localStorage.getItem("token");
    if (token == null) return;

    setIsLoadingSummaries(true);
    getUserSummary(token, user.id).then((summaries) => {
      setDocumentCount(summaries.length);
      // Get the 5 most recent summaries
      const recentSummaries = summaries.slice(0, 5);
      setRecentSummaries(recentSummaries);
      setIsLoadingSummaries(false);
    });
  }, [user]);

  // Separate effect for fetching communities when user is available
  useEffect(() => {
    if (!user?.id) {
      setIsLoadingCommunities(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoadingCommunities(false);
      return;
    }
    setIsLoadingCommunities(true);
    getUserCommunities(token, user.id)
      .then((communities) => {
        communities.forEach((community) => {
          community.volunteers = community.members.filter(
            (member) => member.user.isVolunteer
          );
        });
        if (communities) {
          setJoinedCommunities(communities);
        }
        setIsLoadingCommunities(false);
      })
      .catch((error) => {
        console.error("Error fetching communities:", error);
        setIsLoadingCommunities(false);
      });
  }, [user?.id]); // Only depend on user ID

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    if (diffInHours < 48) return "Kemarin";
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const CommunityCard = ({ community }: { community: Community }) => (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start space-x-3 mb-3">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage
            src={
              community.imagePath
                ? `${import.meta.env.VITE_BACKEND_URL}${community.imagePath}`
                : ""
            }
            alt={community.name}
          />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            {community.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {community.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {community.location.city}, {community.location.province}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {community.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{community.members.length}</span>
              </div>
              <div className="flex items-center">
                <UserCheck className="w-4 h-4 mr-1" />
                <span>{community.volunteers.length}</span>
              </div>
            </div>
            <Link to={"/community/" + community.id}>
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-transparent"
              >
                <Eye className="w-3 h-3 mr-1" />
                Lihat Detail
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

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
            <Link to="/notification">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/profile">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profilePicture || ""} />
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Recent Summaries */}
          <div className="xl:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ringkasan Terbaru</CardTitle>
                    <CardDescription className="text-sm">
                      {documentCount} dokumen diringkas
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingSummaries ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Memuat...</span>
                  </div>
                ) : recentSummaries.length === 0 ? (
                  <div className="text-center py-4">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Belum ada ringkasan</p>
                    <Link to="/summarizer">
                      <Button
                        size="sm"
                        className="mt-2 bg-blue-600 hover:bg-blue-700"
                      >
                        Buat Ringkasan
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentSummaries.map((summary) => (
                      <div
                        key={summary.id}
                        className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start space-x-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FileText className="w-3 h-3 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {summary.summaryTitle}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(summary.createdAt)}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {truncateText(summary.summaryResult, 80)}
                        </p>
                        {summary.language && (
                          <Badge variant="secondary" className="text-xs mt-2">
                            {summary.language}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Dokumen yang Diringkas
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {documentCount}
                      </p>
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
                      <p className="text-2xl font-bold text-gray-900">
                        {joinedCommunities.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Komunitas Baru
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Communities Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">
                      Komunitas Saya
                    </CardTitle>
                    <CardDescription>
                      Komunitas yang telah Anda ikuti
                    </CardDescription>
                  </div>
                  <Link to="/community">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Jelajahi Lebih Banyak
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingCommunities ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-gray-600">Memuat komunitas...</span>
                  </div>
                ) : joinedCommunities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum Bergabung dengan Komunitas
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Mulai bergabung dengan komunitas untuk terhubung dengan
                      pendidik lain.
                    </p>
                    <Link to="/community">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Jelajahi Komunitas
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {joinedCommunities.map((community) => (
                      <CommunityCard key={community.id} community={community} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
