import { useState, useEffect } from "react";

import CreateTourPgae from "../admin/create_n_mng/CreateTour";
import AdminTourRevenue from "../admin/thong_ke/AdminRevenueTour";
import AdminUserList from "../admin/thong_ke/AdminUserList";
import AdminTourManagement from "../admin/create_n_mng/AdminTourManagement";


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeTours: 0,
    totalBookings: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy thống kê tổng quan từ backend thực tế
    Promise.all([
      fetch('http://localhost:8080/api/tour/all').then(res => res.json()).catch(() => []),
      fetch('http://localhost:8080/api/user/all').then(res => res.json()).catch(() => []),
      fetch('http://localhost:8080/api/hoadon/all').then(res => res.json()).catch(() => [])
    ])
    .then(([tours, users, hoaDons]: [any[], any[], any[]]) => {
      // Tính tổng doanh thu từ tất cả hóa đơn
      const totalRevenue = hoaDons.reduce((sum: number, hd: any) => {
        const tourGia = tours.find((t: any) => t.maTour === hd.tour?.maTour)?.giaTour || 0;
        return sum + (tourGia * hd.soKhach);
      }, 0);

      // Tính doanh thu tháng này
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = hoaDons
        .filter((hd: any) => {
          const hdDate = new Date(hd.ngayLapHD);
          return hdDate.getMonth() === currentMonth && hdDate.getFullYear() === currentYear;
        })
        .reduce((sum: number, hd: any) => {
          const tourGia = tours.find((t: any) => t.maTour === hd.tour?.maTour)?.giaTour || 0;
          return sum + (tourGia * hd.soKhach);
        }, 0);

      setStats({
        totalTours: tours.length || 0,
        totalUsers: users.length || 0,
        totalRevenue: totalRevenue,
        activeTours: tours.filter((t: any) => t.trangThai && t.soLuong > 0).length || 0,
        totalBookings: hoaDons.length || 0,
        monthlyRevenue: monthlyRevenue
      });
    })
    .catch((error: any) => {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    })
    .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Bảng điều khiển</h2>
      <p className="text-gray-600 mb-8">Xin chào, admin! Chào mừng bạn quay trở lại.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng Tour</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalTours}</h3>
              <p className="text-sm text-green-600 mt-1">{stats.activeTours} tour đang hoạt động</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng Người Dùng</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</h3>
              <p className="text-sm text-gray-500 mt-1">Khách hàng đã đăng ký</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Doanh Thu Tổng</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {stats.totalRevenue > 0 ? formatCurrency(stats.totalRevenue) : '0 đ'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Tất cả thời gian</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Doanh Thu Tháng Này
          </h3>
          <div className="text-3xl font-bold text-orange-600">
            {stats.monthlyRevenue > 0 ? formatCurrency(stats.monthlyRevenue) : '0 đ'}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Tổng Số Booking
          </h3>
          <div className="text-3xl font-bold text-blue-600">
            {stats.totalBookings}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Hóa đơn đã tạo
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AdminLayout() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      alert("Đã đăng xuất thành công!");
      window.location.href = "/login";
    }
  };

  const renderContent = () => {
    switch(activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "create-tour":
        return <CreateTourPgae/>;
      case "revenue":
        return <AdminTourRevenue/>;
      case "users":
        return <AdminUserList/>;
      case "tours":
        return <AdminTourManagement/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col ">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">VietTravela</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">

          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === "dashboard"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </div>
          </button>

          <button
            onClick={() => setActiveSection("create-tour")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === "create-tour"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo Tour
            </div>
          </button>

          <button
            onClick={() => setActiveSection("revenue")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === "revenue"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Thống Kê Doanh Thu
            </div>
          </button>

          <button
            onClick={() => setActiveSection("users")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === "users"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Người Dùng
            </div>
          </button>

          <button
            onClick={() => setActiveSection("tours")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === "tours"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Quản Lý Tour
            </div>
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng Xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}