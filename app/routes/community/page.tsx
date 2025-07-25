"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ArrowLeft,
  MapPin,
  Users,
  UserPlus,
  Shield,
  User,
} from "lucide-react";
import Loading from "~/components/ui/loading";
import { getCommunity } from "./api";
import type { Route } from "./+types/page";
import ScheduleManager from "./schedule-manager";
import { useAuthGuard } from "~/lib/auth-middleware";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  let token = localStorage.getItem("token");
  if (!token) return null;

  try {
    let response = await getCommunity({ id: params.id, token });
    return response;
  } catch (error) {
    return null;
  }
};

export function HydrateFallback() {
  return <Loading />;
}

export default function CommunityDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const community = loaderData;
  const [activeTab, setActiveTab] = useState("overview");
  const { isAuthenticated } = useAuthGuard();
  

  if (!isAuthenticated()) {
    return null;
  }

  if (!community) return null;

  const getRoleIcon = (role: boolean) => {
    return role ? (
      <Shield className="w-4 h-4 text-blue-600" />
    ) : (
      <User className="w-4 h-4 text-gray-600" />
    );
  };

  const getRoleLabel = (role: boolean) => {
    return role ? "Relawan" : "Anggota";
  };

  const getRoleColor = (role: boolean) => {
    return role ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/home">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke dashboard
                </a>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduReach
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 shadow-lg border-0 overflow-hidden relative">
          <img
            src={
              `${import.meta.env.VITE_BACKEND_URL}${community.imagePath}` ||
              "/placeholder.svg"
            }
            alt={community.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 text-white z-10">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{community.name}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="drop-shadow">{community.location.city} </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span className="drop-shadow">{community.members.length} anggota</span>
              </div>
            </div>
          </div>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Informasi
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Anggota
            </TabsTrigger>
            <TabsTrigger
              value="schedules"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Jadwal
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Tentang Komunitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {community.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Community Stats */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Statistik Komunitas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Anggota</span>
                      <span className="font-semibold">
                        {community.members.length.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>
                  Anggota Komunitas ({community.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {community.members.map((member) => (
                    <Card
                      key={member.user.id}
                      className="border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <img
                              src={
                                `${import.meta.env.VITE_BACKEND_URL}${
                                  member.user.imagePath
                                }` || "/placeholder.svg"
                              }
                              alt={member.user.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {getRoleIcon(member.user.isVolunteer)}
                              <h3 className="font-semibold text-sm truncate border">
                                {member.user.email}
                              </h3>
                            </div>
                            <Badge
                              className={`${getRoleColor(
                                member.user.isVolunteer
                              )} text-xs mb-2`}
                            >
                              {getRoleLabel(member.user.isVolunteer)}
                            </Badge>

                            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                              <span>
                                Bergabung {formatDate(member.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <ScheduleManager communityId={community.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
