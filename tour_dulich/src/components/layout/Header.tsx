import { Link } from "react-router-dom"; // Giả định bạn đang sử dụng React Router DOM
import { User } from "lucide-react";

export const Header = () => {
  const hover = "hover:bg-[#BFDBFE]";
  // Class cơ bản cho các item điều hướng
  const baseItemClass =
    "px-4 py-2 rounded-full text-white font-medium transition duration-200 !no-underline";

  return (
    <header className="bg-[#1f2937] sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white !no-underline">
            VietTravela
          </Link>
        </div>

        <nav className="hidden md:flex items-center p-1 rounded-full bg-gray-700/50 space-x-2 text-white">
          <Link to="/" className={`${baseItemClass} ${hover}`}>
            Trang Chủ
          </Link>

          <Link to="/about" className={`${baseItemClass} ${hover}`}>
            Giới Thiệu
          </Link>

          <div className="group relative">
            <Link
              to="/tours" // Đường dẫn giả định
              className={`flex items-center ${baseItemClass} ${hover}`}
            >
              Tours
            </Link>
          </div>

          <Link to="/contact" className={`${baseItemClass} ${hover}`}>
            Liên Hệ
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            className="text-white hover:text-gray-300 transition p-2"
            aria-label="Tài khoản người dùng"
          >
            <Link
              to="/profile"
              className={`flex items-center ${baseItemClass} ${hover}`}
            >
              <User className="w-6 h-6" />
            </Link>
          </button>
        </div>
      </div>
    </header>
  );
};
