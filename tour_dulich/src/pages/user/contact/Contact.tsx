import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";
import { Link } from "react-router-dom";
import anh1 from "../../../assets/bando.jpg";
import anh2 from "../../../assets/a1.jpg";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong mọi hành trình
            khám phá
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông Tin Liên Hệ
              </h2>
              <p className="text-gray-600 mb-8">
                VietTravel là đơn vị hàng đầu trong lĩnh vực du lịch lữ hành.
                Cam kết mang đến trải nghiệm tốt nhất cho khách hàng trong mọi
                chuyến đi.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Điện Thoại
                  </h3>
                  <p className="text-gray-600">0123 456 789</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">VietTravel@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Địa Chỉ</h3>
                  <p className="text-gray-600">
                    123 Đường ABC, Quận Hoàn Kiếm, Thành phố Hà Nội, Việt Nam
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Dịch Vụ</h3>
              <div className="space-y-2">
                <Link
                  to="/tours"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-md shadow-sm transition"
                >
                  Tours
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center">
            <img
              src={anh2}
              alt="Contact"
              className="rounded-xl w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-4 overflow-hidden">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={anh1}
                alt="Bản đồ vị trí văn phòng"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
