import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  UserCircle,
  LogOut,
  Calendar,
  Map,
  Users,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [hoaDonList, setHoaDonList] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const store = localStorage.getItem("userInfo");
    if (!store) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(store);
    setUserInfo(user);

    fetch(`http://localhost:8080/api/hoadon/user/${user.maUser}`)
      .then((res) => res.json())
      .then((data) => setHoaDonList(data))
      .catch((err) => console.error("Lỗi khi lấy hóa đơn:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Nút Quay lại Trang chủ */}
        <button
          onClick={handleBackToHome}
          className="mb-6 flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <Home className="w-5 h-5" />
          <span>Quay lại Trang chủ</span>
        </button>

        {/* Card chính */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          {/* Header */}
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
              <h1 className="text-3xl font-bold mb-2">{userInfo.hoTen}</h1>
              <p className="text-indigo-100">@{userInfo.tenDangNhap}</p>
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
              <InfoCard
                icon={<Mail className="w-6 h-6 text-white" />}
                title="Email"
                value={userInfo.email}
                color="blue"
              />

              {/* Phone */}
              <InfoCard
                icon={<Phone className="w-6 h-6 text-white" />}
                title="Số điện thoại"
                value={userInfo.soDienThoai}
                color="green"
              />

              {/* CMND */}
              <InfoCard
                icon={<CreditCard className="w-6 h-6 text-white" />}
                title="CMND / CCCD"
                value={userInfo.soCmnd}
                color="purple"
              />

              {/* Địa chỉ */}
              <InfoCard
                icon={<MapPin className="w-6 h-6 text-white" />}
                title="Địa chỉ"
                value={userInfo.diaChi}
                color="orange"
              />
            </div>

            {/* TOUR ĐÃ ĐẶT */}
            <h2 className="text-xl font-bold text-gray-800 mt-10 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              Tour đã đặt
            </h2>

            {hoaDonList.length === 0 ? (
              <p className="text-gray-500 italic">Bạn chưa đặt tour nào.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {hoaDonList.map((hd) => (
                  <div
                    key={hd.maHd}
                    className="group p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          {hd.tour?.tenTour}
                        </p>

                        <p className="text-gray-900 font-medium">
                          <Map className="w-4 h-4 inline mr-1" />
                          Điểm đi: {hd.diemDi}
                        </p>

                        <p className="text-gray-900 font-medium mt-1">
                          <Users className="w-4 h-4 inline mr-1" />
                          Số khách: {hd.soKhach}
                        </p>

                        <p className="text-gray-900 font-medium mt-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Ngày đặt: {hd.ngayLapHD}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value, color }: any) {
  return (
    <div
      className={`group p-5 bg-${color}-50 bg-gradient-to-br from-${color}-50 to-${color}-100/50 rounded-2xl border border-${color}-200 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 bg-${color}-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
          <p className="text-gray-900 font-medium break-words">{value}</p>
        </div>
      </div>
    </div>
  );
}