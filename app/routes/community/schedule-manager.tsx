"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Calendar, Clock } from "lucide-react";
import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  type ICreateSchedule,
  type Schedule,
} from "./api";
import { useUser } from "~/hooks/useUser";

interface I {
  communityId: string;
}

export default function ScheduleManager({ communityId }: I) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
  });
  const [X, setX] = useState(0);
  const { user } = useUser();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) return;

    const combined = new Date(`${formData.date}T${formData.time}:00`); // → 2025-07-24T13:45:00

    const data: ICreateSchedule = {
      communityId: communityId,
      scheduleTime: combined,
    };

    var token = localStorage.getItem("token");

    if (token == null) return;

    const result = await createSchedule(data, token);

    const schedules = await getSchedules(token);

    setSchedules(schedules as any);
  };

  const handleDelete = (id: string) => {
    var token = localStorage.getItem("token");

    if (token == null) return;

    deleteSchedule(id, token);
    setX(X + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) return;
    getSchedules(token).then((result) => {
      setSchedules(result as any);
    });
  }, [X]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Schedule Form */}
        {user?.isVolunteer ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Buat Jadwal Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Buat Jadwal
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {/* Schedule List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Jadwal Komunitas ({schedules.length})
          </h3>
          {schedules.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Belum ada jadwal.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {schedules.map((schedule) => (
                <Card
                  key={schedule.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="">
                    <div className="flex ustify-between items-center">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(schedule.scheduleTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(schedule.scheduleTime)}
                          </div>
                        </div>
                      </div>
                      {user?.isVolunteer && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(schedule.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
