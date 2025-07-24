import { BookOpen } from "lucide-react";

function Logo() {
  return (
    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
      <BookOpen className="w-5 h-5 text-white" />
    </div>
  );
}

export default Logo;
