import { Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl tracking-wide">
              VietTravel
            </h3>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              VietTravel là đơn vị hàng đầu trong lĩnh vực du lịch lữ hành. Cam
              kết mang đến trải nghiệm tốt nhất cho khách hàng trong mỗi chuyến
              đi.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm group">
                <Phone size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <span className="group-hover:text-white transition-colors">
                  0123 456 789
                </span>
              </div>

              <div className="flex items-start gap-3 text-sm group">
                <Mail size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <span className="group-hover:text-white transition-colors">
                  VietTravel@gmail.com
                </span>
              </div>

              <div className="flex items-start gap-3 text-sm group">
                <MapPin size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-6 group-hover:text-white transition-colors">
                  123 Đường ABC, Quận Hoàn Kiếm, Thành phố Hà Nội, Việt Nam
                </span>
              </div>
            </div>
          </div>

          <div className="md:pl-10">
            <h3 className="text-white font-bold text-lg mb-5">Dịch vụ</h3>
            <ul className="space-y-3 text-sm">
              {["Tours", "Tư vấn du lịch"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© 2025 VietTravel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
