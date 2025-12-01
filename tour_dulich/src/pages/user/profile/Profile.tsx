import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  UserCircle,
  LogOut,
} from "lucide-react";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const store = localStorage.getItem("userInfo");
    if (!store) {
      window.location.href = "/login";
      return;
    }
    setUserInfo(JSON.parse(store));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Card chính */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          {/* Header với gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <UserCircle className="w-16 h-16" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{userInfo?.hoTen}</h1>
              <p className="text-indigo-100">@{userInfo?.tenDangNhap}</p>
            </div>
          </div>

          {/* Nội dung */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              Thông tin cá nhân
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="group p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Email
                    </p>
                    <p className="text-gray-900 font-medium break-words">
                      {userInfo?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="group p-5 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Số điện thoại
                    </p>
                    <p className="text-gray-900 font-medium">
                      {userInfo?.soDienThoai}
                    </p>
                  </div>
                </div>
              </div>

              {/* CMND/CCCD */}
              <div className="group p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      CMND / CCCD
                    </p>
                    <p className="text-gray-900 font-medium">
                      {userInfo?.soCmnd}
                    </p>
                  </div>
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="group p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-gray-900 font-medium break-words">
                      {userInfo?.diaChi}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
