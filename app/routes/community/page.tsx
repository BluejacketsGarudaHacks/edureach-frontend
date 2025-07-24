"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  ArrowLeft,
  MapPin,
  Users,
  Star,
  Calendar,
  Clock,
  MessageCircle,
  UserPlus,
  Crown,
  Shield,
  User,
  Video,
  FileText,
} from "lucide-react"
import Loading from "~/components/ui/loading"
import { api } from "~/util/apiClient"
import { getCommunity } from "./api"
import type { Route } from "./+types/page"

interface CommunityMember {
  id: string
  name: string
  role: "creator" | "volunteer" | "member"
  avatar: string
  joinDate: string
  contributionScore: number
  isOnline: boolean
  specialties?: string[]
  bio?: string
}

interface Schedule {
  id: string
  title: string
  description: string
  volunteerId: string
  volunteerName: string
  date: string
  time: string
  duration: string
  type: "study_session" | "discussion" | "workshop" | "q_and_a"
  maxParticipants: number
  currentParticipants: number
  isRecurring: boolean
  meetingLink?: string
}

interface CommunityDetail {
  id: string
  name: string
  description: string
  location: string
  image: string
  memberCount: number
  activeMembers: number
  rating: number
  category: string
  level: string
  tags: string[]
  createdDate: string
  rules: string[]
  members: CommunityMember[]
  schedules: Schedule[]
}

// Mock data for demonstration
const mockCommunityDetail: CommunityDetail = {
  id: "1",
  name: "Matematika SMA Jakarta",
  description:
    "Komunitas belajar matematika untuk siswa SMA di Jakarta. Kami fokus pada pemahaman konsep dasar hingga persiapan UTBK. Bergabunglah dengan ribuan siswa lainnya untuk belajar bersama, diskusi soal, dan saling membantu dalam perjalanan akademik.",
  location: "Jakarta",
  image: "/placeholder.svg?height=400&width=800&text=Matematika+SMA+Jakarta",
  memberCount: 1250,
  activeMembers: 89,
  rating: 4.8,
  category: "Grup Belajar",
  level: "SMA",
  tags: ["UTBK", "Olimpiade", "Kalkulus", "Aljabar", "Geometri"],
  createdDate: "15 Januari 2023",
  rules: [
    "Gunakan bahasa yang sopan dan menghormati sesama anggota",
    "Fokus pada diskusi matematika dan pembelajaran",
    "Dilarang spam atau promosi yang tidak relevan",
    "Bantu sesama anggota dengan memberikan penjelasan yang jelas",
    "Gunakan fitur pencarian sebelum bertanya hal yang sudah dibahas",
  ],
  members: [
    {
      id: "1",
      name: "Pak Budi Santoso",
      role: "creator",
      avatar: "/placeholder.svg?height=60&width=60",
      joinDate: "15 Januari 2023",
      contributionScore: 2500,
      isOnline: true,
      specialties: ["Kalkulus", "Aljabar", "Statistika"],
      bio: "Guru matematika berpengalaman 20 tahun, lulusan ITB. Senang membantu siswa memahami matematika dengan cara yang mudah.",
    },
    {
      id: "2",
      name: "Bu Sari Dewi",
      role: "volunteer",
      avatar: "/placeholder.svg?height=60&width=60",
      joinDate: "20 Januari 2023",
      contributionScore: 1800,
      isOnline: true,
      specialties: ["Geometri", "Trigonometri"],
      bio: "Mahasiswa S2 Matematika UI, aktif mengajar les privat dan bimbel.",
    },
    {
      id: "3",
      name: "Kak Dimas",
      role: "volunteer",
      avatar: "/placeholder.svg?height=60&width=60",
      joinDate: "25 Januari 2023",
      contributionScore: 1200,
      isOnline: false,
      specialties: ["UTBK", "Olimpiade"],
      bio: "Alumni OSN Matematika, mahasiswa Teknik ITB. Siap membantu persiapan olimpiade dan UTBK.",
    },
    {
      id: "4",
      name: "Andi Pratama",
      role: "member",
      avatar: "/placeholder.svg?height=60&width=60",
      joinDate: "1 Februari 2023",
      contributionScore: 450,
      isOnline: true,
      bio: "Siswa SMA kelas 12, sedang persiapan UTBK.",
    },
    {
      id: "5",
      name: "Sinta Maharani",
      role: "member",
      avatar: "/placeholder.svg?height=60&width=60",
      joinDate: "5 Februari 2023",
      contributionScore: 320,
      isOnline: false,
      bio: "Siswa SMA kelas 11, suka matematika dan ingin ikut olimpiade.",
    },
    {
      id: "6",
      name: "Rizki Ramadhan",
      role: "member",
      avatar: "/placeholder.svg?height=60&width=60",
      joinDate: "10 Februari 2023",
      contributionScore: 280,
      isOnline: true,
      bio: "Siswa SMA kelas 10, baru mulai belajar matematika tingkat lanjut.",
    },
  ],
  schedules: [
    {
      id: "1",
      title: "Belajar Kalkulus Dasar",
      description: "Pengenalan konsep limit, turunan, dan integral untuk pemula",
      volunteerId: "1",
      volunteerName: "Pak Budi Santoso",
      date: "2024-01-28",
      time: "19:00",
      duration: "90 menit",
      type: "study_session",
      maxParticipants: 30,
      currentParticipants: 18,
      isRecurring: true,
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "2",
      title: "Diskusi Soal UTBK Matematika",
      description: "Pembahasan soal-soal UTBK tahun sebelumnya dan tips mengerjakan",
      volunteerId: "3",
      volunteerName: "Kak Dimas",
      date: "2024-01-29",
      time: "20:00",
      duration: "60 menit",
      type: "discussion",
      maxParticipants: 25,
      currentParticipants: 22,
      isRecurring: false,
      meetingLink: "https://zoom.us/j/123456789",
    },
    {
      id: "3",
      title: "Workshop Geometri Ruang",
      description: "Memahami konsep geometri ruang dengan visualisasi 3D",
      volunteerId: "2",
      volunteerName: "Bu Sari Dewi",
      date: "2024-01-30",
      time: "16:00",
      duration: "120 menit",
      type: "workshop",
      maxParticipants: 20,
      currentParticipants: 15,
      isRecurring: false,
      meetingLink: "https://meet.google.com/xyz-uvwx-yz",
    },
    {
      id: "4",
      title: "Sesi Tanya Jawab Mingguan",
      description: "Sesi terbuka untuk bertanya tentang materi matematika apapun",
      volunteerId: "1",
      volunteerName: "Pak Budi Santoso",
      date: "2024-01-31",
      time: "18:30",
      duration: "45 menit",
      type: "q_and_a",
      maxParticipants: 50,
      currentParticipants: 12,
      isRecurring: true,
    },
    {
      id: "5",
      title: "Persiapan Olimpiade Matematika",
      description: "Latihan soal olimpiade tingkat kabupaten dan provinsi",
      volunteerId: "3",
      volunteerName: "Kak Dimas",
      date: "2024-02-01",
      time: "19:30",
      duration: "90 menit",
      type: "study_session",
      maxParticipants: 15,
      currentParticipants: 8,
      isRecurring: true,
      meetingLink: "https://meet.google.com/olim-piad-math",
    },
  ],
}


export const clientLoader = async ({params}:Route.ClientLoaderArgs) => {

  let token = localStorage.getItem('token')
  if (!token) return null

  try {
    let response = await getCommunity({id:params.id,token})
    return response
  } catch (error) {
    console.log(error)
    return null
  }
}

export function HydrateFallback() {
  return <Loading />;
}

export default function CommunityDetailPage({ loaderData }: Route.ComponentProps) {
    const community = loaderData
    const [activeTab, setActiveTab] = useState("overview")

    if (!community) return null

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "creator":
        return <Crown className="w-4 h-4 text-yellow-600" />
      case "volunteer":
        return <Shield className="w-4 h-4 text-blue-600" />
      case "member":
        return <User className="w-4 h-4 text-gray-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "creator":
        return "Pembuat Komunitas"
      case "volunteer":
        return "Relawan"
      case "member":
        return "Anggota"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "creator":
        return "bg-yellow-100 text-yellow-800"
      case "volunteer":
        return "bg-blue-100 text-blue-800"
      case "member":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/community">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Komunitas
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
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/auth">Masuk</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <Card className="mb-8 shadow-lg border-0 overflow-hidden">
          <div className="relative">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${community?.imagePath}` || "/placeholder.svg"}
              alt={community.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{community.location.city}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{community.members.length} anggota</span>
                </div>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Gabung Komunitas
              </Button>
            </div>
          </div>
        </Card>

        {/* Community Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Informasi
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Anggota
            </TabsTrigger>
            <TabsTrigger value="schedules" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
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
                    <p className="text-gray-700 leading-relaxed mb-4">{community.description}</p>
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
                      <span className="font-semibold">{community.members.length.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          {/* <TabsContent value="members" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Anggota Komunitas ({community.members.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {community.members.map((member) => (
                    <Card key={member.user.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <img
                              src={`${import.meta.env.VITE_BACKEND_URL}${member.user.imagePath}` || "/placeholder.svg"}
                              alt={member.user.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {getRoleIcon(member.role)}
                              <h3 className="font-semibold text-sm truncate">{member.name}</h3>
                            </div>
                            <Badge className={`${getRoleColor(member.role)} text-xs mb-2`}>
                              {getRoleLabel(member.role)}
                            </Badge>
                            {member.specialties && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {member.specialties.slice(0, 2).map((specialty, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                                {member.specialties.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{member.specialties.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                            {member.bio && <p className="text-xs text-gray-600 line-clamp-2">{member.bio}</p>}
                            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                              <span>Bergabung {member.joinDate}</span>
                              <span>{member.contributionScore} poin</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* Schedules Tab */}
          {/* <TabsContent value="schedules" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Jadwal Kegiatan ({community.schedules.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {community.schedules.map((schedule) => (
                    <Card key={schedule.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              
                              <h3 className="font-semibold text-lg">{schedule.title}</h3>
                              {schedule.isRecurring && (
                                <Badge variant="outline" className="text-xs">
                                  Berulang
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{schedule.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{formatDate(schedule.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>
                                  {schedule.time} ({schedule.duration})
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>
                                  {schedule.currentParticipants}/{schedule.maxParticipants} peserta
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-600">Relawan:</span>
                              <span className="font-medium">{schedule.volunteerName}</span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Daftar
                            </Button>
                            {schedule.meetingLink && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={schedule.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Video className="w-4 h-4 mr-2" />
                                  Link
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(schedule.currentParticipants / schedule.maxParticipants) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
