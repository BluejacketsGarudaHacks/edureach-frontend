"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle, Clock, Users, BookOpen, MessageSquare, ArrowLeft, BellOff, BellOffIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router"
import { checkNotification, getNotifications, type Notification } from "./api"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NotificationsPage() {
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    try {
        const response = await getNotifications();
        setNotifications(response);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
  }

  const markAsRead = async (notification: Notification) => {
    setReadNotifications((prev) => new Set([...prev, notification.id]))
    try {
        await checkNotification(notification)
    }
    catch(error) {
        console.error("Failed to check the notification", error);
    }
  }
  
  const handleGoBack = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                <Button variant="ghost" onClick={handleGoBack} className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke dashboard
                </Button>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    EduReach
                    </span>
                </div>
                </div>
            </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your educational journey</p>
            </div>
        </div>

        <Card className="mb-6">
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Notifikasi baru
                </CardTitle>
                <Badge className="bg-purple-600">
                    {notifications.filter((n) => !n.isChecked).length}
                </Badge>
            </div>
            </CardHeader>

            <CardContent className="grid gap-4">
                {notifications.filter(n => !n.isChecked).length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 py-6">
                    <BellOffIcon className="h-10 w-10 mb-2 text-gray-400" />
                    <p className="text-sm">Tidak ada notifikasi baru</p>
                </div>
                ) : (
                notifications
                    .filter(notification => !notification.isChecked)
                    .map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-3 rounded-lg transition-all ${
                        readNotifications.has(notification.id) ? "bg-gray-50 opacity-70" : "bg-purple-50"
                        }`}
                    >
                        <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            readNotifications.has(notification.id) ? "bg-gray-400" : "bg-purple-600"
                        }`}
                        >
                        <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p
                            className={`font-medium ${
                                readNotifications.has(notification.id) ? "text-gray-500" : "text-gray-900"
                            }`}
                            >
                            {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {dayjs(notification.createdAt).fromNow()}
                            </Badge>
                            {!readNotifications.has(notification.id) && (
                                <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-purple-100"
                                onClick={() => markAsRead(notification)}
                                >
                                <CheckCircle className="h-4 w-4 text-purple-600" />
                                </Button>
                            )}
                            </div>
                        </div>
                        <p
                            className={`text-sm mt-1 ${
                            readNotifications.has(notification.id)
                                ? "text-gray-400"
                                : "text-muted-foreground"
                            }`}
                        >
                            {notification.message}
                        </p>
                        </div>
                    </div>
                    ))
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                Notifikasi yang sudah dibaca
                </CardTitle>
            </div>
            </CardHeader>
            <CardContent className="grid gap-4">
            {notifications.filter(notification => notification.isChecked).map((notification) => (
                <div
                key={notification.id}
                className="flex items-start gap-4 p-3 rounded-lg"
                >
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-600">{notification.message}</p>
                    <Badge variant="outline" className="text-xs text-gray-500">
                        {dayjs(notification.createdAt).fromNow()}
                    </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                    </p>
                </div>
                </div>
            ))}
            </CardContent>
        </Card>
        </div>
    </div>
  )
}
