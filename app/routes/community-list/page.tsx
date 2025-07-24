"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, MapPin, Users, UserCheck, Plus, Grid3X3, List, BookOpen } from "lucide-react"
import { useAuthGuard } from "~/lib/auth-middleware"

interface Community {
  id: string
  name: string
  description: string
  location: string
  image: string
  memberCount: number
  volunteerCount: number
  category: string
  isJoined: boolean
}

const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Jakarta Math Teachers",
    description:
      "A community for mathematics educators in Jakarta to share innovative teaching methods, resources, and collaborate on curriculum development.",
    location: "Jakarta",
    image: "/placeholder.svg?height=200&width=300",
    memberCount: 245,
    volunteerCount: 18,
    category: "Mathematics",
    isJoined: true,
  },
  {
    id: "2",
    name: "Surabaya Science Hub",
    description:
      "Connecting science teachers and students across Surabaya to promote hands-on learning and scientific discovery through experiments and projects.",
    location: "Surabaya",
    image: "/placeholder.svg?height=200&width=300",
    memberCount: 189,
    volunteerCount: 23,
    category: "Science",
    isJoined: false,
  },
  {
    id: "3",
    name: "Bandung Language Exchange",
    description:
      "Multilingual education community focusing on Indonesian, English, and regional languages. Perfect for language teachers and learners.",
    location: "Bandung",
    image: "/placeholder.svg?height=200&width=300",
    memberCount: 156,
    volunteerCount: 12,
    category: "Language",
    isJoined: false,
  },
  {
    id: "4",
    name: "Medan Digital Learning",
    description:
      "Embracing technology in education. Share digital tools, online resources, and innovative teaching methods for the modern classroom.",
    location: "Medan",
    image: "/placeholder.svg?height=200&width=300",
    memberCount: 134,
    volunteerCount: 15,
    category: "Technology",
    isJoined: true,
  },
  {
    id: "5",
    name: "Yogyakarta Arts & Culture",
    description:
      "Preserving and teaching Indonesian arts, culture, and traditional values through creative educational approaches and cultural activities.",
    location: "Yogyakarta",
    image: "/placeholder.svg?height=200&width=300",
    memberCount: 98,
    volunteerCount: 8,
    category: "Arts & Culture",
    isJoined: false,
  },
  {
    id: "6",
    name: "Semarang Primary Education",
    description:
      "Supporting primary school teachers with age-appropriate teaching strategies, classroom management tips, and child development resources.",
    location: "Semarang",
    image: "/placeholder.svg?height=200&width=300",
    memberCount: 167,
    volunteerCount: 14,
    category: "Primary Education",
    isJoined: false,
  },
  {
    id: "7",
    name: "Makassar Environmental Studies",
    description:
      "Teaching environmental awareness and sustainability through practical projects and community engagement in South Sulawesi.",
    location: "Makassar",
    image: "/placeholder.svg?height=200&width=300",
    memberCount: 89,
    volunteerCount: 11,
    category: "Environmental",
    isJoined: false,
  },
  {
    id: "8",
    name: "Palembang Special Needs",
    description:
      "Dedicated to inclusive education and supporting teachers who work with students with special needs and learning disabilities.",
    location: "Palembang",
    image: "/placeholder.svg?height=200&width=300",
    memberCount: 76,
    volunteerCount: 9,
    category: "Special Education",
    isJoined: true,
  },
]

const indonesianCities = [
  "All Cities",
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
  "Yogyakarta",
]

const categories = [
  "All Categories",
  "Mathematics",
  "Science",
  "Language",
  "Technology",
  "Arts & Culture",
  "Primary Education",
  "Environmental",
  "Special Education",
]

const sortOptions = [
  { value: "members", label: "Most Members" },
  { value: "volunteers", label: "Most Volunteers" },
  { value: "name", label: "Name A-Z" },
  { value: "location", label: "Location A-Z" },
]

export default function CommunityListPage() {
  window.document.title = "Jelajahi Komunitas | EduReach"

  const { isAuthenticated } = useAuthGuard();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All Cities")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("members")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [communities, setCommunities] = useState(mockCommunities)

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  const filteredAndSortedCommunities = useMemo(() => {
    const filtered = communities.filter((community) => {
      const matchesSearch =
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLocation = selectedLocation === "All Cities" || community.location === selectedLocation
      const matchesCategory = selectedCategory === "All Categories" || community.category === selectedCategory

      return matchesSearch && matchesLocation && matchesCategory
    })

    // Sort communities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "members":
          return b.memberCount - a.memberCount
        case "volunteers":
          return b.volunteerCount - a.volunteerCount
        case "name":
          return a.name.localeCompare(b.name)
        case "location":
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

    return filtered
  }, [communities, searchQuery, selectedLocation, selectedCategory, sortBy])

  const handleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId
          ? {
              ...community,
              isJoined: !community.isJoined,
              memberCount: community.isJoined ? community.memberCount - 1 : community.memberCount + 1,
            }
          : community,
      ),
    )
  }

  const handleGoBack = () => {
    console.log("Navigate back to home")
  }

  const handleCreateCommunity = () => {
    console.log("Navigate to create community page")
  }

  const CommunityCard = ({ community }: { community: Community }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img src={community.image || "/placeholder.svg"} alt={community.name} className="w-full h-full object-cover" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">{community.name}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {community.location}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {community.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-4">{community.description}</CardDescription>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{community.memberCount}</span>
            </div>
            <div className="flex items-center">
              <UserCheck className="w-4 h-4 mr-1" />
              <span>{community.volunteerCount}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => handleJoinCommunity(community.id)}
          className={`w-full ${
            community.isJoined
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          }`}
          variant={community.isJoined ? "outline" : "default"}
        >
          {community.isJoined ? "Joined" : "Join Community"}
        </Button>
      </CardContent>
    </Card>
  )

  const CommunityListItem = ({ community }: { community: Community }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={community.image || "/placeholder.svg"}
            alt={community.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{community.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {community.location}
                </div>
              </div>
              <Badge variant="outline" className="text-xs ml-2">
                {community.category}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{community.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{community.memberCount} members</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 mr-1" />
                  <span>{community.volunteerCount} volunteers</span>
                </div>
              </div>

              <Button
                onClick={() => handleJoinCommunity(community.id)}
                size="sm"
                className={
                  community.isJoined
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }
                variant={community.isJoined ? "outline" : "default"}
              >
                {community.isJoined ? "Joined" : "Join"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleGoBack} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
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

            <Button
              onClick={handleCreateCommunity}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Communities</h1>
          <p className="text-gray-600">
            Join educational communities across Indonesia and connect with fellow educators and learners.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-2 bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-start gap-2">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                {indonesianCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle and Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedCommunities.length} of {communities.length} communities
            </p>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Communities Grid/List */}
        {filteredAndSortedCommunities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No communities found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or create a new community.</p>
            <Button
              onClick={handleCreateCommunity}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredAndSortedCommunities.map((community) => (
              <div key={community.id}>
                {viewMode === "grid" ? (
                  <CommunityCard community={community} />
                ) : (
                  <CommunityListItem community={community} />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
