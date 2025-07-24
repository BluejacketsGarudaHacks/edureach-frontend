import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "./component/form";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { checkAuth } from "~/lib/auth-loader";

export default function RegisterPage() {
  useEffect(() => {
    window.document.title = "Daftar | EduReach";
  }, []);

  const nav = useNavigate();

  useEffect(() => {
    if (checkAuth()) {
      nav("/home", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <Button
        variant="ghost"
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-900"
        asChild
      >
        <a href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </a>
      </Button>

      <div className="w-full max-w-md relative z-10">
        <RegisterForm />
      </div>

      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-10 blur-xl"></div>
    </div>
  );
}
