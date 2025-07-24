"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, Users, MapPin, FileText, ImageIcon, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router"
import { createCommunity, type createCommunityInput } from "./api"
import { toast } from "sonner"
import axios from "axios"
import { useAuthGuard } from "~/lib/auth-middleware"
import { useEditor } from "@tiptap/react"

const indonesianLocations = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Bogor",
  "Batam",
  "Pekanbaru",
  "Bandar Lampung",
  "Malang",
  "Yogyakarta",
  "Solo",
  "Denpasar",
  "Balikpapan",
  "Samarinda",
  "Pontianak",
  "Manado",
  "Mataram",
  "Kupang",
  "Jayapura",
  "Ambon",
  "Banda Aceh",
  "Padang",
  "Jambi",
  "Bengkulu",
]

export default function CreateCommunityPage() {
  useEffect(() => {
    window.document.title = "Buat Komunitas | EduReach"
  }, [])

  const { isAuthenticated } = useAuthGuard();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const navigate = useNavigate();

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
  } = useForm<createCommunityInput>()

  const watchedLocation = watch("locationid")
  const watchedImage = watch("image")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: createCommunityInput) => {
    setIsSubmitting(true)
    try {
      await createCommunity({data})
    } catch (error) {
      if (axios.isAxiosError(error)){
            toast("Pendaftaran komunitas gagal. " + error.message)
        }
    }
    console.log("Community Data:", {
      name: data.name,
      description: data.description,
      location: data.locationid,
      image: data.image.name || "No image selected",
    })

    setIsSubmitting(false)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
      reset()
      setSelectedImage(null)
    }, 3000)
  }

  const handleGoBack = () => {
    navigate("/home")
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Komunitas berhasil terbuat!</h2>
            <p className="text-gray-600 mb-6">
              Komunitas anda berhasil terbuat dan terbuka untuk diikuti.
            </p>
            <Button onClick={handleGoBack} className="w-full">
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Membuat komunitas baru</h1>
          <p className="text-gray-600">
            Build a learning community to connect educators and students across Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Community Details</span>
                </CardTitle>
                <CardDescription>Fill in the information below to create your educational community.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Community Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Community Name *</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Jakarta Math Teachers"
                      {...register("name", {
                        required: "Community name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                        maxLength: {
                          value: 50,
                          message: "Name must be less than 50 characters",
                        },
                      })}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Description *</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your community's purpose, goals, and what members can expect..."
                      rows={4}
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters",
                        },
                        maxLength: {
                          value: 500,
                          message: "Description must be less than 500 characters",
                        },
                      })}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Location *</span>
                    </Label>
                    <Select onValueChange={(value) => setValue("locationid", value)}>
                      <SelectTrigger className={errors.locationid ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a city in Indonesia" />
                      </SelectTrigger>
                      <SelectContent>
                        {indonesianLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
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
                    {errors.locationid && <p className="text-sm text-red-600">{errors.locationid.message}</p>}
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image" className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Community Image</span>
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
                            <p className="text-sm text-gray-600">Click to change image</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-5 space-y-2">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto m-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Click to upload an image</p>
                              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                          Create Community
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
                <CardDescription>This is how your community will appear to others</CardDescription>
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
                  <h3 className="font-semibold text-gray-900">{watch("name") || "Community Name"}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {watchedLocation || "Location"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {watch("description") || "Community description will appear here..."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Users className="w-4 h-4" />
              <AlertDescription>
                Once created, your community will be visible to all EduReach users. You'll become the community
                administrator and can manage members and content.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  )
}
