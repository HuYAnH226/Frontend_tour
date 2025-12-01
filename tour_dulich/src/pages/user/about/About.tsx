import { Mountain, Users, Handshake, Leaf } from "lucide-react"; // Đã đổi Sun thành Leaf cho ý nghĩa Du lịch Bền vững rõ ràng hơn
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer"; // Thêm Footer để đồng bộ với trang Home

export const About = () => {
  return (
    // Đồng bộ background với Home, sử dụng gradient nhẹ
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      {/* 🏞️ Phần Banner/Tiêu đề Trang - Tối ưu hóa độ tương phản và căn chỉnh */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Chào mừng đến với **VietTravela**! ✈️
          </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-95 font-light text-blue-100">
            Khám phá vẻ đẹp bất tận của Việt Nam cùng chúng tôi – nơi hành trình
            của bạn là sứ mệnh của chúng tôi.
          </p>
        </div>
      </section>

      {/* 📜 Phần Giới thiệu Chung - Căn chỉnh hình ảnh và văn bản rõ ràng hơn */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
                Về Chúng Tôi
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                **VietTravela** được thành lập với niềm đam mê sâu sắc dành cho
                du lịch Việt Nam. Chúng tôi tin rằng mỗi chuyến đi không chỉ là
                việc ngắm cảnh mà còn là trải nghiệm văn hóa, ẩm thực, và kết
                nối con người. Sứ mệnh của chúng tôi là mang đến những tour du
                lịch **độc đáo, chất lượng cao, an toàn và bền vững**, giúp du
                khách khám phá những viên ngọc ẩn của đất nước hình chữ S.
              </p>
              <div className="text-gray-700 leading-relaxed bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500 shadow-inner">
                <p className="font-medium">
                  Đội ngũ của chúng tôi là những chuyên gia du lịch dày dặn kinh
                  nghiệm, luôn sẵn sàng hỗ trợ bạn từ khâu lên kế hoạch đến khi
                  kết thúc hành trình. Chúng tôi cam kết mang lại sự hài lòng
                  tuyệt đối cho mọi khách hàng.
                </p>
              </div>
            </div>

            {/* Thêm một block ảnh/minh họa - Tăng tính thu hút và cân bằng */}
            <div className="order-1 md:order-2 mt-12 md:mt-0 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl h-80 lg:h-96 bg-gray-200 flex items-center justify-center border-4 border-white transform rotate-3 hover:rotate-0 transition duration-500 ease-in-out">
                {/* Thay thế bằng một ảnh thực tế về Việt Nam hoặc để trống */}
                <span className="text-gray-500 text-xl font-semibold italic"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-8 max-w-5xl mx-auto border-blue-200" />

      <section className="py-20 bg-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-16">
            🧭 Giá Trị Cốt Lõi Của Chúng Tôi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-white rounded-xl shadow-lg border-b-4 border-blue-600 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <Mountain className="w-12 h-12 text-blue-600 mx-auto mb-5" />
              <h4 className="text-xl font-bold mb-3 text-gray-800">
                Trải Nghiệm Độc Đáo
              </h4>
              <p className="text-gray-500 text-base leading-relaxed">
                Thiết kế các tour vượt ra khỏi lối mòn, khám phá vẻ đẹp đích
                thực và nguyên sơ của Việt Nam.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl shadow-lg border-b-4 border-indigo-600 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-5" />
              <h4 className="text-xl font-bold mb-3 text-gray-800">
                Khách Hàng Là Trọng Tâm
              </h4>
              <p className="text-gray-500 text-base leading-relaxed">
                Luôn lắng nghe và cá nhân hóa hành trình để đáp ứng mọi nhu cầu
                của du khách với dịch vụ tận tâm.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl shadow-lg border-b-4 border-blue-600 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <Handshake className="w-12 h-12 text-blue-600 mx-auto mb-5" />
              <h4 className="text-xl font-bold mb-3 text-gray-800">
                Minh Bạch & Tin Cậy
              </h4>
              <p className="text-gray-500 text-base leading-relaxed">
                Cung cấp thông tin rõ ràng, giá cả công khai và dịch vụ đáng tin
                cậy từ đối tác đến hướng dẫn viên.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl shadow-lg border-b-4 border-indigo-600 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <Leaf className="w-12 h-12 text-indigo-600 mx-auto mb-5" />
              <h4 className="text-xl font-bold mb-3 text-gray-800">
                Du Lịch Bền Vững
              </h4>
              <p className="text-gray-500 text-base leading-relaxed">
                Bảo tồn môi trường và hỗ trợ cộng đồng địa phương trong mỗi
                chuyến đi, hướng đến lợi ích lâu dài.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-extrabold text-gray-800 mb-4">
            Sẵn sàng cho cuộc phiêu lưu tiếp theo? ✨
          </h3>
          <p className="text-xl text-gray-600 mb-10">
            Hãy để VietTravela biến giấc mơ du lịch của bạn thành hiện thực.
          </p>
          <a
            href="/tours" // Giả sử có route /tours
            className="inline-block bg-blue-600 text-white text-xl font-semibold px-12 py-4 rounded-full hover:bg-indigo-700 transition duration-300 shadow-2xl transform hover:scale-105 active:scale-95 ring-4 ring-blue-300 !no-underline"
          >
            Khám Phá Các Tour Của Chúng Tôi
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};
