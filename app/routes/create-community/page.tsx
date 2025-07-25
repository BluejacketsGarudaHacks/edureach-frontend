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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Upload,
  Users,
  MapPin,
  FileText,
  ImageIcon,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { createCommunity, type createCommunityInput } from "./api";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useAuthGuard } from "~/lib/auth-middleware";
import { useEditor } from "@tiptap/react";
import type { Route } from "./+types/page";
import type { Location } from "~/interfaces/location";
import Loading from "~/components/ui/loading";

export const clientLoader = async () => {
  let indonesianLocations: Location[] = [];

  let token = localStorage.getItem("token");
  if (!token) return indonesianLocations;

  try {
    let response = await axios.get<Location[]>(
      `${import.meta.env.VITE_BACKEND_URL}/api/location`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return indonesianLocations;
  }
};

export function HydrateFallback() {
  return <Loading />;
}

export default function CreateCommunityPage({
  loaderData,
}: Route.ComponentProps) {
  useEffect(() => {
    window.document.title = "Buat Komunitas | EduReach";
  }, []);

  const { isAuthenticated } = useAuthGuard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  let indonesianLocations = loaderData;

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<createCommunityInput>();

  const watchedLocation = watch("locationid");
  const watchedImage = watch("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: createCommunityInput) => {
    setIsSubmitting(true);

    const token = window.localStorage.getItem("token");
    if (!token) {
      toast("Anda tidak diperbolehkan untuk mendaftar komunitas");
      return;
    }
    try {
      data.image = selectedFile!;
      await createCommunity({ data, token });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast("Pendaftaran komunitas gagal. " + error.message);
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      reset();
      setSelectedImage(null);
    }, 3000);
  };

  const handleGoBack = () => {
    navigate("/home");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Komunitas berhasil terbuat!
            </h2>
            <p className="text-gray-600 mb-6">
              Komunitas anda berhasil terbuat dan terbuka untuk diikuti.
            </p>
            <Button onClick={handleGoBack} className="w-full">
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Membuat komunitas baru
          </h1>
          <p className="text-gray-600">
            Buat sebuah komunitas belajar untuk menghubungkan para pendidik dan
            siswa di seluruh Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Detail Komunitas</span>
                </CardTitle>
                <CardDescription>
                  Isi informasi berikut untuk membuat komunitas belajar Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Community Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Nama Komunitas *</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Jakarta Math Teachers"
                      {...register("name", {
                        required: "Nama komunitas harus diisi",
                        minLength: {
                          value: 3,
                          message: "Nama harus terdiri dari minimal 3 karakter",
                        },
                        maxLength: {
                          value: 50,
                          message: "Nama harus terdiri dari maksimal 50 karakter",
                        },
                      })}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Deskripsi *</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Deskripsikan tujuan komunitas, target, dan apa saja yang diekspektasi oleh para pelajar.."
                      rows={4}
                      {...register("description", {
                        required: "Deskripsi harus diisi",
                        minLength: {
                          value: 20,
                          message: "Deskripsi harus terdiri dari minimal 20 karakter",
                        },
                        maxLength: {
                          value: 500,
                          message:
                            "Deskripsi harus terdiri dari maksimal 500 karakter",
                        },
                      })}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Lokasi *</span>
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("locationid", value)}
                    >
                      <SelectTrigger
                        className={errors.locationid ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Pilih sebuah kota di Indonesia" />
                      </SelectTrigger>
                      <SelectContent>
                        {indonesianLocations
                          .sort((a, b) => a.city.localeCompare(b.city))
                          .map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>
                              {loc.city}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register("locationid", {
                        required: "Please select a location",
                      })}
                    />
                    {errors.locationid && (
                      <p className="text-sm text-red-600">
                        {errors.locationid.message}
                      </p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="image"
                      className="flex items-center space-x-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Gambar Komunitas</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Label htmlFor="image" className="cursor-pointer">
                        {selectedImage ? (
                          <div className="space-y-2">
                            <img
                              src={selectedImage || "/placeholder.svg"}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-sm text-gray-600">
                              Klik untuk mengganti gambar
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-5 space-y-2">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto m-0" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">
                                Klik untuk menggungah gambar
                              </p>
                              <p className="text-sm text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </Label>
                    </div>
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
                          Creating Community...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Buat Komunitas
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview/Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Komunitas akan terlihat seperti ini ke orang lain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedImage ? (
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Community preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No image selected</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {watch("name") || "Nama Komunitas"}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {indonesianLocations.find((e) => e.id == watchedLocation)
                      ?.city || "Lokasi"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {watch("description") ||
                      "Deskripsi komunitas akan muncul di sini..."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Users className="w-4 h-4" />
              <AlertDescription>
                Setelah dibuat, komunitas Anda akan terlihat ke semua pengguna EduReach.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  );
}
