"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  MapPin,
  Users,
  UserCheck,
  Plus,
  Grid3X3,
  List,
  BookOpen,
} from "lucide-react";
import { useAuthGuard } from "~/lib/auth-middleware";
import { getCommunities, getLocations, joinCommunity } from "./api";
import type { Community } from "~/interfaces/community";
import type { Location } from "~/interfaces/location";
import { Link } from "react-router";
import { useUser } from "~/hooks/useUser";
import { toast, Toaster } from "sonner";

const sortOptions = [
  { value: "members", label: "Most Members" },
  { value: "volunteers", label: "Most Volunteers" },
  { value: "name", label: "Name A-Z" },
  { value: "location", label: "Location A-Z" },
];

export default function CommunityListPage() {
  useEffect(() => {
    window.document.title = "Jelajahi Komunitas | EduReach";
  }, []);

  const { user, loading: userLoading } = useUser();
  const { isAuthenticated } = useAuthGuard();
  
  // All state hooks must be called before any conditional logic
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState("Semua Kota");
  const [selectedProvince, setSelectedProvince] = useState("Semua Provinsi");
  const [sortBy, setSortBy] = useState("members");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [indonesianCities, setIndonesianCities] = useState<string[]>([]);
  const [indonesianProvinces, setIndonesianProvinces] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // useMemo hook must also be called before conditional returns
  const filteredAndSortedCommunities = useMemo(() => {
    const filtered = communities.filter((community) => {
      const matchesSearch =
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation =
        selectedCities === "Semua Kota" ||
        community.location.city === selectedCities;
      const matchesCategory =
        selectedProvince === "Semua Provinsi" ||
        community.location.province === selectedProvince;

      return matchesSearch && matchesLocation && matchesCategory;
    });

    // Sort communities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "members":
          return b.members.length - a.members.length;
        case "volunteers":
          return b.volunteers.length - a.volunteers.length;
        case "name":
          return a.name.localeCompare(b.name);
        case "location":
          return a.location.city.localeCompare(b.location.city);
        default:
          return 0;
      }
    });

    return filtered;
  }, [communities, searchQuery, selectedCities, selectedProvince, sortBy]);

  useEffect(() => {
    // Wait for user to be loaded before fetching data
    if (userLoading) return;
    
    const token = localStorage.getItem("token");
    if (token && user) {
      Promise.all([
        getLocations(token),
        getCommunities(token)
      ]).then(([locations, communities]) => {
        const cities = locations.map((loc) => loc.city);
        const provinces = locations.map((loc) => loc.province);
        setLocations(locations);
        setIndonesianCities(["Semua Kota", ...new Set(cities)]);
        setIndonesianProvinces(["Semua Provinsi", ...new Set(provinces)]);

        communities.forEach((community) => {
          community.volunteers = community.members.filter(
            (member) => member.user.isVolunteer
          );
          community.isJoined =
            community.members.filter((member) => member.userId == user?.id)
              .length > 0 ||
            community.volunteers.filter((member) => member.userId == user?.id)
              .length > 0;
        });

        setCommunities(communities);
        setDataLoading(false);
      }).catch((error) => {
        console.error("Failed to fetch community data:", error);
        setDataLoading(false);
      });
    } else if (!userLoading && !user) {
      // User loading finished but no user found
      setDataLoading(false);
    }
  }, [user, userLoading]); // Depend on both user and userLoading

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // Show loading state while user or data is loading
  if (userLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat komunitas...</p>
        </div>
      </div>
    );
  }

  const handleJoinCommunity = async (communityId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await joinCommunity(communityId, user?.id || "", token);
    toast(
      response
        ? "Bergabung dengan komunitas berhasil!"
        : "Gagal bergabung dengan komunitas"
    );
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleChangeProvince = (value: string) => {
    setSelectedProvince(value);
    // Update city options based on selected province
    if (value === "Semua Provinsi") {
      setIndonesianCities([
        "Semua Kota",
        ...new Set(locations.map((loc) => loc.city)),
      ]);
    } else {
      setIndonesianCities([
        "Semua Kota",
        ...new Set(
          locations
            .filter((loc) => loc.province === value)
            .map((loc) => loc.city)
        ),
      ]);
    }
    setSelectedCities("Semua Kota"); // Reset city filter when province changes
  };

  const CommunityCard = ({ community }: { community: Community }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img
          src={
            `${import.meta.env.VITE_BACKEND_URL}${community.imagePath}` || ""
          }
          alt={community.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {community.name}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {community.location.province}, {community.location.city}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-4">
          {community.description}
        </CardDescription>

        <div className="flex items-center justify-between mb-4">
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
          {community.isJoined ? "Sudah Diikuti" : "Ikuti Komunitas"}
        </Button>
      </CardContent>
    </Card>
  );

  const CommunityListItem = ({ community }: { community: Community }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={
              `${import.meta.env.VITE_BACKEND_URL}${community.imagePath}` || ""
            }
            alt={community.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {community.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {community.location.province}, {community.location.city}
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
                  <span>{community.members.length} members</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 mr-1" />
                  <span>{community.volunteers.length} volunteers</span>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => handleJoinCommunity(community.id)}
                className={
                  community.isJoined
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }
                variant={community.isJoined ? "outline" : "default"}
              >
                {community.isJoined ? "Sudah Diikuti" : "Ikuti Komunitas"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Toaster />
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to={"/home"}>
                <Button variant="ghost" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduReach
                </span>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link
                className="flex items-center justify-center"
                to={"/create-community"}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Komunitas Baru
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Jelajahi Komunitas
          </h1>
          <p className="text-gray-600">
            Ikuti komunitas-komunitas belajar di seluruh Indonesia dan perluas
            koneksi dengan sesama pendidik dan pelajar.
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
                  placeholder="Cari komunitas.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Location Filter */}
            <Select
              value={selectedProvince}
              onValueChange={handleChangeProvince}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Provinsi" />
              </SelectTrigger>
              <SelectContent>
                {indonesianProvinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCities} onValueChange={setSelectedCities}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Kota" />
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
              Menampilkan {filteredAndSortedCommunities.length} dari{" "}
              {communities.length} komunitas
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum ada Komunitas
            </h3>
            <p className="text-gray-600 mb-4">
              Coba sesuaikan kriteria pencarian Anda atau buat komunitas baru.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link
                className="flex justify-center items-center"
                to={"/create-community"}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Komunitas Baru
              </Link>
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
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
  );
}
