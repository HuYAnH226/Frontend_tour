import { useState, useEffect } from "react";
import {
  Clock,
  Users,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";
import { useNavigate } from "react-router-dom";

interface Tour {
  maTour: string;
  tenTour: string;
  diemKhoiHanh: string;
  moTa: string;
  soNgay: number;
  soChoToiDa: number;
  giaTour: number;
  trangThai: boolean;
  lichKhoiHanh: any[];
  anhTour: string;

}

export default function Tour() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Search states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [selectedDuration, setSelectedDuration] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
  }, []);

const fetchTours = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/tour/all");
    const data = await response.json();

    // Lọc chỉ lấy tour có trangThai = true (public)
    const visible = data.filter((t: any) => t.trangThai === true);

    // chuẩn hóa ảnh
    const normalized: Tour[] = visible.map((t: any) => {
      let img = t.anhTour || "";
      if (img && !img.startsWith("http")) {
        img = "http://localhost:8080" + img;
      }
      return { ...t, anhTour: img };
    });

    setTours(normalized);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching tours:", error);
    setLoading(false);
  }
};


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "hanoi", name: "Từ Hà Nội" },
    { id: "hcm", name: "Từ TP.HCM" },
  ];

  const durationOptions = [
    { id: "all", name: "Tất cả" },
    { id: "1-2", name: "1-2 ngày" },
    { id: "3-4", name: "3-4 ngày" },
    { id: "5+", name: "5+ ngày" },
  ];

  // Filter tours based on all criteria
  const filteredTours = tours.filter((tour) => {
    // Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "hanoi" && tour.diemKhoiHanh !== "Hà Nội")
        return false;
      if (selectedCategory === "hcm" && tour.diemKhoiHanh !== "TP. HCM")
        return false;
    }

    // Keyword search
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const matchName = tour.tenTour.toLowerCase().includes(keyword);
      const matchDescription = tour.moTa.toLowerCase().includes(keyword);
      const matchDeparture = tour.diemKhoiHanh.toLowerCase().includes(keyword);

      if (!matchName && !matchDescription && !matchDeparture) {
        return false;
      }
    }

    // Price range filter
    if (tour.giaTour < priceRange.min || tour.giaTour > priceRange.max) {
      return false;
    }

    // Duration filter
    if (selectedDuration !== "all") {
      if (selectedDuration === "1-2" && (tour.soNgay < 1 || tour.soNgay > 2))
        return false;
      if (selectedDuration === "3-4" && (tour.soNgay < 3 || tour.soNgay > 4))
        return false;
      if (selectedDuration === "5+" && tour.soNgay < 5) return false;
    }

    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchKeyword("");
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 10000000 });
    setSelectedDuration("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Khám Phá Việt Nam Cùng Chúng Tôi
            </h2>
            <p className="text-xl text-blue-100">
              Những chuyến đi đáng nhớ, trải nghiệm khó quên
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tour, điểm đến..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                  {searchKeyword && (
                    <button
                      onClick={() => setSearchKeyword("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition ${
                    showFilters
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Bộ lọc</span>
                </button>

                {/* Search Button */}
                <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105">
                  Tìm kiếm
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số ngày
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {durationOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedDuration(option.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            selectedDuration === option.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Khoảng giá: {formatPrice(priceRange.min)} -{" "}
                      {formatPrice(priceRange.max)}
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="500000"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Reset Filters Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Xóa bộ lọc</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-md"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Tìm thấy{" "}
            <span className="font-bold text-blue-600">
              {filteredTours.length}
            </span>{" "}
            tour
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredTours.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Không tìm thấy tour phù hợp
            </h3>
            <p className="text-gray-500 mb-6">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <div
                key={tour.maTour}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 duration-300"
              >
                {/* Image */}
                <div className="relative h-48">
  {tour.anhTour ? (
    <img
      src={tour.anhTour}
      alt={tour.tenTour}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={(e) => {
        // nếu ảnh lỗi, đổi về fallback gradient
        const el = e.currentTarget as HTMLImageElement;
        el.style.display = "none";
        const parent = el.parentElement;
        if (parent) {
          parent.querySelector(".fallback")?.classList.remove("hidden");
        }
      }}
    />
  ) : null}

  {/* Fallback khi ko có ảnh hoặc image error */}
  <div className={`fallback ${tour.anhTour ? "hidden" : ""} w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-6xl font-bold`}>
    {tour.tenTour ? tour.tenTour.charAt(0) : "T"}
  </div>

  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
    {tour.diemKhoiHanh}
  </div>
</div>


                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {tour.tenTour}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {tour.moTa}
                  </p>

                  {/* Tour Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{tour.soNgay} ngày</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Tối đa: {tour.soChoToiDa} người</span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Giá từ</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(tour.giaTour)}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/tours/${tour.maTour}/detail`)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}