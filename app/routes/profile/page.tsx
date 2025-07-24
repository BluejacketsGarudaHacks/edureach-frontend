"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, User, Mail, Calendar, Lock, Camera, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useAuthGuard } from "~/lib/auth-middleware"

interface ProfileFormData {
  fullName: string
  email: string
  dateOfBirth: string
  profilePicture: FileList
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function EditProfilePage() {
  const { isAuthenticated } = useAuthGuard();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("/placeholder.svg?height=120&width=120")
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      dateOfBirth: "1990-01-15",
    },
  })

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPassword,
  } = useForm<PasswordFormData>()

  const newPassword = watchPassword("newPassword")

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

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Profile Data:", {
      fullName: data.fullName,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      profilePicture: data.profilePicture[0]?.name || "No image selected",
    })

    setIsSubmitting(false)
    setIsSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setIsSuccess(false)
    }, 3000)
  }

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsPasswordSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Password changed successfully")

    setIsPasswordSubmitting(false)
    setIsPasswordSuccess(true)
    resetPassword()

    // Close modal and hide success message after 2 seconds
    setTimeout(() => {
      setIsPasswordSuccess(false)
      setIsPasswordModalOpen(false)
    }, 2000)
  }

  const handleGoBack = () => {
    console.log("Navigate back to home")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your personal information and account settings.</p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">Your profile has been updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Update your personal details and profile picture.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="space-y-4">
                    <Label className="flex items-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Profile Picture</span>
                    </Label>
                    <div className="flex items-center space-x-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={selectedImage || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg">JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          {...registerProfile("profilePicture")}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Label htmlFor="profilePicture" className="cursor-pointer">
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Change Picture
                            </span>
                          </Button>
                        </Label>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Full Name *</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      {...registerProfile("fullName", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                        maxLength: {
                          value: 50,
                          message: "Name must be less than 50 characters",
                        },
                      })}
                      className={profileErrors.fullName ? "border-red-500" : ""}
                    />
                    {profileErrors.fullName && <p className="text-sm text-red-600">{profileErrors.fullName.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address *</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      {...registerProfile("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className={profileErrors.email ? "border-red-500" : ""}
                    />
                    {profileErrors.email && <p className="text-sm text-red-600">{profileErrors.email.message}</p>}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date of Birth *</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...registerProfile("dateOfBirth", {
                        required: "Date of birth is required",
                        validate: (value) => {
                          const today = new Date()
                          const birthDate = new Date(value)
                          const age = today.getFullYear() - birthDate.getFullYear()
                          if (age < 13) return "You must be at least 13 years old"
                          if (age > 120) return "Please enter a valid date of birth"
                          return true
                        },
                      })}
                      className={profileErrors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {profileErrors.dateOfBirth && (
                      <p className="text-sm text-red-600">{profileErrors.dateOfBirth.message}</p>
                    )}
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
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new secure password.
                      </DialogDescription>
                    </DialogHeader>

                    {isPasswordSuccess && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">Password changed successfully!</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password *</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            {...registerPassword("currentPassword", {
                              required: "Current password is required",
                            })}
                            className={passwordErrors.currentPassword ? "border-red-500 pr-10" : "pr-10"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                        )}
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password *</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            {...registerPassword("newPassword", {
                              required: "New password is required",
                              minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                              },
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: "Password must contain uppercase, lowercase, and number",
                              },
                            })}
                            className={passwordErrors.newPassword ? "border-red-500 pr-10" : "pr-10"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            {...registerPassword("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) => value === newPassword || "Passwords do not match",
                            })}
                            className={passwordErrors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPasswordModalOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isPasswordSubmitting}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {isPasswordSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Password Requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• At least 8 characters long</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one symbol</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <User className="w-4 h-4" />
              <AlertDescription>
                Your profile information is visible to other community members. Make sure to keep your details up to
                date.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  )
}
