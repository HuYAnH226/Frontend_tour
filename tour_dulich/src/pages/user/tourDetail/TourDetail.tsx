import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";

export default function TourDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // State để quản lý Modal và Booking Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    soKhach:"1", 
    diemDi: "", 
  });
  // Danh sách tỉnh thành Việt Nam
  const tinhThanhVietNam = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];
  

  // Lấy thông tin người dùng từ Local Storage
  const store = localStorage.getItem("userInfo");
  const userInfo = store ? JSON.parse(store) : null;
  const maUser = userInfo ? userInfo.maUser : null;

  // --- API Fetch Tour Detail ---
  useEffect(() => {
    fetch(`http://localhost:8080/api/tour/${id}/detail`)
      .then((res) => res.json())
      .then((data) => setTour(data))
      .catch((err) => console.log(err));
  }, [id]);

  // --- Hàm định dạng tiền tệ ---
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // --- Hàm xử lý Đặt Tour ---
  const handleBooking = async () => {
  // 1. Kiểm tra thông tin cần thiết
  if (!maUser || !id) {
    alert(
      "⚠️ Thiếu thông tin người dùng hoặc mã tour. Vui lòng đăng nhập lại."
    );
    return;
  }
  if (!bookingData.diemDi || bookingData.soKhach < 1) {
    alert("⚠️ Vui lòng nhập đầy đủ Số khách và Điểm đi.");
    return;
  }
  if (bookingData.soKhach > tour.soChoToiDa) {
    alert(
      `⚠️ Số lượng khách tối đa cho tour này là ${tour.soChoToiDa}. Vui lòng kiểm tra lại.`
    );
    return;
  }

  // 2. TẠO NGÀY/GIỜ CHÍNH XÁC
  const ngayLapHD = new Date().toISOString().slice(0, 19);

  // 3. Chuẩn bị dữ liệu hóa đơn
  const requestBody = {
    ngayLapHD: ngayLapHD,
    soKhach: bookingData.soKhach,
    trangThai: "Đã thanh toán",
    diemDi: bookingData.diemDi,
  };

  try {
    // ✅✅✅ BƯỚC 1: GỌI API GIẢM SỐ LƯỢNG TOUR
    console.log(`🎫 Đang giảm số lượng tour: ${id}, số người: ${bookingData.soKhach}`);
    
    const bookTourResponse = await fetch(
      `http://localhost:8080/api/tour/${id}/book?soLuongDat=${bookingData.soKhach}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!bookTourResponse.ok) {
      const errorText = await bookTourResponse.text();
      throw new Error(errorText || "Không thể đặt tour. Tour có thể đã hết chỗ.");
    }

    console.log("✅ Giảm số lượng tour thành công!");

    // ✅✅✅ BƯỚC 2: TẠO HÓA ĐƠN
    console.log("📝 Đang tạo hóa đơn...");
    
    const response = await fetch(
      `http://localhost:8080/api/hoadon/create?userId=${maUser}&tourId=${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      // Thành công
      alert("🎉 Đặt tour thành công! Vui lòng kiểm tra email xác nhận.");
      setIsModalOpen(false);
      
      // Reload lại thông tin tour để cập nhật số lượng
      fetch(`http://localhost:8080/api/tour/${id}/detail`)
        .then((res) => res.json())
        .then((data) => setTour(data))
        .catch((err) => console.log(err));
        
    } else {
      // Lỗi tạo hóa đơn
      const errorText = await response.text();
      console.error("Lỗi tạo hóa đơn:", errorText);
      
      // Nếu tạo hóa đơn thất bại, có thể cần hoàn lại số lượng tour
      // (tùy logic của bạn)
      
      alert(
        `❌ Đã xảy ra lỗi khi tạo hóa đơn. Mã lỗi: ${response.status}. Chi tiết xem trong console.`
      );
    }
  } catch (error) {
    console.error("Lỗi khi đặt tour:", error);
    alert(`⚠️ Đã xảy ra lỗi: ${error.message}`);
  }
};

  // --- Hiển thị Loading ---
  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">
            Đang tải thông tin tour...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Render Trang Chi Tiết Tour ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      {/* Hero Image Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {tour.tenTour}
            </h1>
            <p className="text-xl text-blue-100">{tour.moTa}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center text-blue-600 mb-2">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-semibold">Thời gian</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {tour.soNgay} Ngày
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center text-blue-600 mb-2">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="font-semibold">Số chỗ</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {tour.soChoToiDa} người
                </p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-md mb-8">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-6 py-4 font-semibold whitespace-nowrap ${
                      activeTab === "overview"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Tổng quan
                  </button>
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`px-6 py-4 font-semibold whitespace-nowrap ${
                      activeTab === "itinerary"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Lịch trình
                  </button>
                  <button
                    onClick={() => setActiveTab("schedule")}
                    className={`px-6 py-4 font-semibold whitespace-nowrap ${
                      activeTab === "schedule"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Lịch khởi hành
                  </button>
                </div>
              </div>

              <div className="p-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Giới thiệu
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {tour.moTa}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Điểm đến
                      </h3>
                      <div className="flex items-center text-lg">
                        <svg
                          className="w-6 h-6 text-blue-600 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-900">
                          {tour.tenDiaDiemDen}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Thông tin tour
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <svg
                            className="w-5 h-5 text-blue-600 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">
                            Thời gian: <strong>{tour.soNgay} ngày</strong>
                          </span>
                        </div>
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <svg
                            className="w-5 h-5 text-blue-600 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">
                            Số chỗ: <strong>{tour.soChoToiDa} người</strong>
                          </span>
                        </div>
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <svg
                            className="w-5 h-5 text-blue-600 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">
                            Trạng thái:{" "}
                            <strong className="text-green-600">
                              Đang hoạt động
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Itinerary Tab */}
                {activeTab === "itinerary" && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Lịch trình chi tiết
                    </h3>
                    {tour.lichTrinh && tour.lichTrinh.length > 0 ? (
                      <div className="space-y-6">
                        {tour.lichTrinh.map((item, index) => (
                          <div
                            key={index}
                            className="relative pl-8 pb-8 border-l-2 border-blue-200 last:border-l-0 last:pb-0"
                          >
                            <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                              <h4 className="font-bold text-lg text-gray-900 mb-2">
                                {item.tieuDe || `Ngày ${index + 1}`}
                              </h4>
                              <p className="text-gray-700">
                                {item.moTa ||
                                  "Nội dung chi tiết sẽ được cập nhật"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg
                          className="w-16 h-16 text-gray-300 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          Lịch trình chi tiết đang được cập nhật
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === "schedule" && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Các ngày khởi hành
                    </h3>
                    {tour.lichKhoiHanh && tour.lichKhoiHanh.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {tour.lichKhoiHanh.map((lich, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200"
                          >
                            <div className="flex items-center mb-3">
                              <svg
                                className="w-6 h-6 text-blue-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="font-bold text-gray-900">
                                {lich.ngayKhoiHanh || "Đang cập nhật"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Số chỗ còn nhận:{" "}
                              <strong className="text-green-600">
                                {lich.soChoConLai || tour.soChoToiDa}
                              </strong>
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg
                          className="w-16 h-16 text-gray-300 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          Lịch khởi hành đang được cập nhật
                        </p>
                        <p className="text-gray-400 mt-2">
                          Vui lòng liên hệ để biết thêm chi tiết
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-gray-600 text-sm mb-2">Giá chỉ từ</div>
                  <div className="text-4xl font-bold text-blue-600">
                    {formatPrice(tour.giaTour)}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">/ người</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Mã tour:</span>
                    <span className="font-semibold text-gray-900">
                      #{tour.maTour}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-semibold text-gray-900">
                      {tour.soNgay} ngày
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Số chỗ:</span>
                    <span className="font-semibold text-green-600">
                      {tour.soChoToiDa} chỗ
                    </span>
                  </div>
                </div>

                {/* Nút Đặt Tour - Mở Modal */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors shadow-md hover:shadow-lg mb-3"
                >
                  Đặt Tour Ngay
                </button>

                <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 rounded-lg transition-colors">
                  Liên Hệ Tư Vấn
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Liên hệ đặt tour
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>0123 456 789</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>VietTravel@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Cam kết của chúng tôi
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Giá tốt nhất thị trường
                    </span>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Hoàn tiền 100% nếu hủy tour
                    </span>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">Hỗ trợ 24/7</span>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Đảm bảo chất lượng dịch vụ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* --------------------------- MODAL THANH TOÁN --------------------- */}
      {/* ------------------------------------------------------------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 m-4">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                 Xác Nhận Đặt Tour
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-lg font-semibold text-blue-600">
                Tour: {tour.tenTour}
              </p>

              {/* Lưu ý nhỏ */}
              {!maUser && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm"
                  role="alert"
                >
                  <strong className="font-bold">Cảnh báo:</strong>
                  <span className="block sm:inline">
                    {" "}
                    Bạn chưa đăng nhập. Vui lòng đăng nhập để hoàn tất đặt tour.
                  </span>
                </div>
              )}

              {/* Input Số Khách */}
              <div>
                <label
                  htmlFor="soKhach"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số lượng khách (tối đa {tour.soChoToiDa})
                </label>
                <input
                  type="number"
                  id="soKhach"
                  value={bookingData.soKhach}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      soKhach:
                        parseInt(e.target.value) > 0
                          ? parseInt(e.target.value)
                          : 1,
                    })
                  }
                  min="1"
                  max={tour.soChoToiDa}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Dropdown Chọn Điểm Đi */}
              <div>
                <label
                  htmlFor="diemDi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Điểm đi (Chọn tỉnh/thành phố)
                </label>
                <select
                  id="diemDi"
                  value={bookingData.diemDi}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, diemDi: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                >
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {tinhThanhVietNam.map((tinh, index) => (
                    <option key={index} value={tinh}>
                      {tinh}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thông tin hiển thị Tổng tiền */}
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
                <p>
                  <span className="font-medium">Giá tour một khách:</span>{" "}
                  {formatPrice(tour.giaTour)}
                </p>
                <p className="font-bold text-xl mt-2 text-red-600">
                  Tổng thanh toán:{" "}
                  {formatPrice(tour.giaTour * bookingData.soKhach)}
                </p>
              </div>
            </div>

            {/* Nút Thanh Toán */}
            <button
              onClick={handleBooking}
              disabled={!maUser} // Disable nếu chưa đăng nhập
              className={`mt-6 w-full font-semibold py-3 rounded-lg transition-colors shadow-md ${
                !maUser
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
               Thanh Toán và Xác Nhận Đặt Tour
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
