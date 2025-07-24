import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { BookOpen, Users, Zap, ArrowRight, Play, Star } from "lucide-react"
import { Link } from "react-router"
import Logo from "~/components/logo"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduReach
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fitur</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">Tentang Kami</a>
            <Link to={"/auth/login"}>
                <Button variant="outline" size="sm">Masuk</Button>
            </Link>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Zap className="w-3 h-3 mr-1" />
          Telah Hadir
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
          Mewujudkan Potensi
          <br />
          Setiap Siswa
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Revolusi pendidikan Indonesia dengan platform AI yang menghubungkan siswa, guru, dan komunitas dalam
          pengalaman belajar yang bermakna dan dapat diakses oleh semua.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/auth/register">
            <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
            <Play className="w-4 h-4 mr-2" />
            Lihat Demo
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-600">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="font-semibold text-gray-900">4.8/5</span>&nbsp;dari 1,500+ pendidik Indonesia
          </div>
          <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
          <div>
            <span className="font-semibold text-gray-900">25,000+</span> siswa aktif
          </div>
          <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
          <div>
            <span className="font-semibold text-gray-900">800+</span> komunitas di Indonesia
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Fitur Unggulan untuk Pendidikan Indonesia
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Teknologi AI dan komunitas yang kuat untuk mendukung pembelajaran yang merata di seluruh Indonesia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Summarizer AI Multibahasa</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Rangkum materi pembelajaran dalam bahasa Indonesia, Inggris, atau bahasa daerah dengan teknologi AI canggih.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">Bahasa Indonesia</Badge>
                <Badge variant="secondary" className="text-xs">Bali</Badge>
                <Badge variant="secondary" className="text-xs">Jawa</Badge>
                <Badge variant="secondary" className="text-xs">Sunda</Badge>
                <Badge variant="secondary" className="text-xs">Batak Toba</Badge>
                <Badge variant="secondary" className="text-xs">Batak Karo</Badge>
                <Badge variant="secondary" className="text-xs">Batak Simalungun</Badge>
                <Badge variant="secondary" className="text-xs">Minang</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Komunitas Guru Relawan</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bergabung dengan komunitas pendidik Indonesia dan jadilah guru relawan untuk berbagi ilmu dengan sesama.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">
                  Mengajar Gratis
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Komunitas Aktif
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Sertifikat
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">EduReach</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EduReach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
