import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

type TourForm = {
  maTour: string;
  tenTour: string;
  diemKhoiHanh: string;
  diaDiemId: string;
  moTa: string;
  soNgay: string;
  soChoToiDa: string;
  giaTour: string;
  trangThai: boolean;
};

// Cập nhật types theo database của bạn
type DiaDiem = {
  ma_dd: number;
  ten_dd: string;
  hinh_anh: string;
};

type DichVu = {
  ma_dv: number;
  ten_dv: string;
  don_gia: number;
  ma_ncc: number;
};

type NhaCungCap = {
  ma_ncc: number;
  ten_ncc: string;
  dia_chi: string;
  email: string;
  sdt: string;
};

type LichTrinhItem = {
  diaDiemId: string;
  dichVuId: string;
  nhaCungCapId: string;
  loai: string;
  moTa: string;
  ten_dd?: string;
  ten_dv?: string;
  ten_ncc?: string;
  don_gia?: number;
};

type LichKhoiHanhItem = {
  ngayKhoiHanh: string;
  ngayKetThuc: string;
  soCho: string;
};

export default function CreateTour() {
  const [form, setForm] = useState<TourForm>({
    maTour: "",
    tenTour: "",
    diemKhoiHanh: "",
    diaDiemId: "",
    moTa: "",
    soNgay: "",
    soChoToiDa: "",
    giaTour: "",
    trangThai: true,
  });

  const [lichTrinh, setLichTrinh] = useState<LichTrinhItem[]>([
    { diaDiemId: "", dichVuId: "", nhaCungCapId: "", loai: "dd", moTa: "" },
  ]);

  const [lichKhoiHanh, setLichKhoiHanh] = useState<LichKhoiHanhItem[]>([
    { ngayKhoiHanh: "", ngayKetThuc: "", soCho: "" },
  ]);

  // States cho tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<(DiaDiem | DichVu)[]>([]);
  const [nhaCungCapList, setNhaCungCapList] = useState<NhaCungCap[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);

  // Mock data theo database của bạn
  const mockDiaDiemData: DiaDiem[] = [
    { ma_dd: 1, ten_dd: "Hà Nội", hinh_anh: "https://mg.example/hanoi.jpg" },
    { ma_dd: 2, ten_dd: "Hạ Long", hinh_anh: "https://mg.example/halong.jpg" },
    { ma_dd: 3, ten_dd: "Sapa", hinh_anh: "https://mg.example/sapa.jpg" },
    { ma_dd: 4, ten_dd: "Đà Nẵng", hinh_anh: "https://mg.example/danang.jpg" },
    { ma_dd: 5, ten_dd: "Hội An", hinh_anh: "https://mg.example/hoian.jpg" },
    { ma_dd: 6, ten_dd: "Huế", hinh_anh: "https://mg.example/hue.jpg" },
    { ma_dd: 7, ten_dd: "Nha Trang", hinh_anh: "https://mg.example/nhatrang.jpg" },
    { ma_dd: 8, ten_dd: "Đà Lạt", hinh_anh: "https://mg.example/dalat.jpg" },
    { ma_dd: 9, ten_dd: "Phú Quốc", hinh_anh: "https://mg.example/phuquoc.jpg" },
    { ma_dd: 10, ten_dd: "Cần Thơ", hinh_anh: "https://mg.example/cantho.jpg" },
  ];

  const mockDichVuData: DichVu[] = [
    { ma_dv: 1, ten_dv: "Khách sạn 3 sao", don_gia: 800000, ma_ncc: 4 },
    { ma_dv: 2, ten_dv: "Khách sạn 4 sao", don_gia: 1200000, ma_ncc: 4 },
    { ma_dv: 3, ten_dv: "Vé tham quan", don_gia: 200000, ma_ncc: 1 },
    { ma_dv: 4, ten_dv: "Xe đưa đón du lịch", don_gia: 500000, ma_ncc: 3 },
    { ma_dv: 5, ten_dv: "Bữa trưa đặc sản địa phương", don_gia: 250000, ma_ncc: 5 },
    { ma_dv: 6, ten_dv: "Lặn biển Snorkeling", don_gia: 700000, ma_ncc: 7 },
    { ma_dv: 7, ten_dv: "Tàu tham quan vịnh", don_gia: 600000, ma_ncc: 2 },
    { ma_dv: 8, ten_dv: "Resort ven biển cao cấp", don_gia: 1800000, ma_ncc: 9 },
    { ma_dv: 9, ten_dv: "Homestay view núi", don_gia: 600000, ma_ncc: 8 },
    { ma_dv: 10, ten_dv: "Du thuyền sông Mekong", don_gia: 1500000, ma_ncc: 10 },
  ];

  const mockNhaCungCapData: NhaCungCap[] = [
    { ma_ncc: 1, ten_ncc: "Sun Travel", dia_chi: "Hà Nội", email: "sales@suntravel.vn", sdt: "0901000001" },
    { ma_ncc: 2, ten_ncc: "Blue Sea Tours", dia_chi: "Hải Phòng", email: "contact@bluesea.vn", sdt: "0901000002" },
    { ma_ncc: 3, ten_ncc: "Highland Logistics", dia_chi: "Lào Cai", email: "ops@highland.vn", sdt: "0901000003" },
    { ma_ncc: 4, ten_ncc: "Central Hotel Group", dia_chi: "Đà Nẵng", email: "book@centralhotel.vn", sdt: "0901000004" },
    { ma_ncc: 5, ten_ncc: "Ancient Town Service", dia_chi: "Hội An", email: "hi@andenttown.vn", sdt: "0901000005" },
    { ma_ncc: 6, ten_ncc: "Imperial Heritage", dia_chi: "Huế", email: "info@imperialheritage.vn", sdt: "0901000006" },
    { ma_ncc: 7, ten_ncc: "Oceanic Dive", dia_chi: "Nha Trang", email: "support@oceanicdive.vn", sdt: "0901000007" },
    { ma_ncc: 8, ten_ncc: "Pine Hill Stay", dia_chi: "Đà Lạt", email: "team@pinehill.vn", sdt: "0901000008" },
    { ma_ncc: 9, ten_ncc: "Island Gateway", dia_chi: "Phú Quốc", email: "cs@islandgateway.vn", sdt: "0901000009" },
    { ma_ncc: 10, ten_ncc: "Mekong Cruiser", dia_chi: "Cần Thơ", email: "book@mekongcruiser.vn", sdt: "0901000010" },
  ];

  // Tìm kiếm địa điểm/dịch vụ - Sử dụng mock data
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    
    setIsSearching(true);
    try {
      // Sử dụng mock data thay vì gọi API
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập delay
      
      const filteredDiaDiem = mockDiaDiemData.filter(dd => 
        dd.ten_dd.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      
      const filteredDichVu = mockDichVuData.filter(dv => 
        dv.ten_dv.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      
      const results = [...filteredDiaDiem, ...filteredDichVu];
      setSearchResults(results);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      // Fallback: vẫn sử dụng mock data ngay cả khi có lỗi
      const filteredDiaDiem = mockDiaDiemData.filter(dd => 
        dd.ten_dd.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      const filteredDichVu = mockDichVuData.filter(dv => 
        dv.ten_dv.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setSearchResults([...filteredDiaDiem, ...filteredDichVu]);
    } finally {
      setIsSearching(false);
    }
  };

  // Lấy danh sách nhà cung cấp theo dịch vụ - Sử dụng mock data
  const fetchNhaCungCap = async (dichVuId: string) => {
    try {
      // Tìm dịch vụ được chọn
      const selectedDichVu = mockDichVuData.find(dv => dv.ma_dv === parseInt(dichVuId));
      if (!selectedDichVu) return;
      
      // Tìm nhà cung cấp tương ứng
      const nhaCungCap = mockNhaCungCapData.find(ncc => ncc.ma_ncc === selectedDichVu.ma_ncc);
      if (nhaCungCap) {
        setNhaCungCapList([nhaCungCap]);
      }
    } catch (error) {
      console.error("Lỗi lấy nhà cung cấp:", error);
    }
  };

  // Chọn địa điểm/dịch vụ từ kết quả tìm kiếm
  const handleSelectItem = (item: DiaDiem | DichVu, index: number) => {
    if ('ten_dd' in item) {
      // Là địa điểm
      updateLichTrinh(index, "diaDiemId", item.ma_dd.toString());
      updateLichTrinh(index, "ten_dd", item.ten_dd);
      updateLichTrinh(index, "loai", "dd");
    } else {
      // Là dịch vụ
      updateLichTrinh(index, "dichVuId", item.ma_dv.toString());
      updateLichTrinh(index, "ten_dv", item.ten_dv);
      updateLichTrinh(index, "loai", "dv");
      updateLichTrinh(index, "don_gia", item.don_gia);
      fetchNhaCungCap(item.ma_dv.toString());
    }
    setSearchResults([]);
    setSearchKeyword("");
    setCurrentEditingIndex(null);
  };

  // Chọn nhà cung cấp
  const handleSelectNhaCungCap = (ncc: NhaCungCap, index: number) => {
    updateLichTrinh(index, "nhaCungCapId", ncc.ma_ncc.toString());
    updateLichTrinh(index, "ten_ncc", ncc.ten_ncc);
    setNhaCungCapList([]);
  };

  const updateForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateLichTrinh = (index: number, field: keyof LichTrinhItem, value: any) => {
    setLichTrinh((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const updateLichKhoiHanh = (index: number, field: keyof LichKhoiHanhItem, value: string) => {
    setLichKhoiHanh((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const addLichTrinh = () => {
    setLichTrinh((prev) => [
      ...prev,
      { diaDiemId: "", dichVuId: "", nhaCungCapId: "", loai: "dd", moTa: "" },
    ]);
  };

  const removeLichTrinh = (index: number) => {
    setLichTrinh((prev) => prev.filter((_, i) => i !== index));
  };

  const addLichKhoiHanh = () => {
    setLichKhoiHanh((prev) => [
      ...prev,
      { ngayKhoiHanh: "", ngayKetThuc: "", soCho: "" },
    ]);
  };

  const removeLichKhoiHanh = (index: number) => {
    setLichKhoiHanh((prev) => prev.filter((_, i) => i !== index));
  };

  const startSearch = (index: number) => {
    setCurrentEditingIndex(index);
    setSearchKeyword("");
    setSearchResults([]);
    setNhaCungCapList([]);
  };

  const submit = async () => {
  const payload = {
    maTour: form.maTour || "TOUR001",
    tenTour: form.tenTour || "Tour mặc định",
    diemKhoiHanh: form.diemKhoiHanh || "Hà Nội",
    diaDiemId: form.diaDiemId ? Number(form.diaDiemId) : 1,
    moTa: form.moTa || "Mô tả tour",
    soNgay: form.soNgay ? Number(form.soNgay) : 3,
    soChoToiDa: form.soChoToiDa ? Number(form.soChoToiDa) : 20,
    giaTour: form.giaTour ? Number(form.giaTour) : 1000000,
    trangThai: true,
    lichTrinh: lichTrinh.map((i, index) => ({
      diaDiemId: i.diaDiemId ? Number(i.diaDiemId) : null,
      dichVuId: i.dichVuId ? Number(i.dichVuId) : null,
      loai: i.loai || "dd",
      moTa: i.moTa || ""
    })),
    lichKhoiHanh: lichKhoiHanh.map((i) => ({
      ngayKhoiHanh: i.ngayKhoiHanh || "2024-01-01",
      ngayKetThuc: i.ngayKetThuc || "2024-01-03", 
      soCho: i.soCho ? Number(i.soCho) : 10
    }))
  };

  console.log("Payload đầy đủ:", payload);

  try {
    const res = await fetch("http://localhost:8080/api/tour/create-full", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Status:", res.status);
    
    // XỬ LÝ RESPONSE AN TOÀN
    const responseText = await res.text();
    console.log("Response text:", responseText);

    let data;
    try {
      // Thử parse JSON
      data = JSON.parse(responseText);
    } catch (parseError) {
      // Nếu không phải JSON, tạo object thủ công
      console.log("Response không phải JSON, là text:", responseText);
      data = {
        success: res.ok,
        status: res.status,
        rawResponse: responseText,
        message: "Tạo tour thành công (response không phải JSON)"
      };
    }

    setResult(data);
    
    if (res.status === 201) {
      alert(" Tạo tour thành công!");
      console.log(" TOUR ĐÃ ĐƯỢC TẠO THÀNH CÔNG!");
    } else {
      alert(`Lỗi ${res.status}: ${JSON.stringify(data)}`);
    }

  } catch (e) {
    console.error("Lỗi kết nối:", e);
    setResult({ error: "Lỗi kết nối: " + e.message });
  }
};

  // Xử lý Enter khi tìm kiếm
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Lên Lịch Trình Tour</h1>

      {/* Form tour cơ bản */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h2>Thông Tin Tour Cơ Bản</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label>Mã tour:</label>
            <input
              placeholder="Mã tour"
              name="maTour"
              value={form.maTour}
              onChange={updateForm}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div>
            <label>Tên tour:</label>
            <input
              placeholder="Tên tour"
              name="tenTour"
              value={form.tenTour}
              onChange={updateForm}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div>
            <label>Điểm khởi hành:</label>
            <input
              placeholder="Điểm khởi hành"
              name="diemKhoiHanh"
              value={form.diemKhoiHanh}
              onChange={updateForm}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div>
            <label>Địa điểm chính:</label>
            <select
              name="diaDiemId"
              value={form.diaDiemId}
              onChange={(e) => setForm(prev => ({...prev, diaDiemId: e.target.value}))}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">Chọn địa điểm chính</option>
              {mockDiaDiemData.map(dd => (
                <option key={dd.ma_dd} value={dd.ma_dd}>
                  {dd.ten_dd}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Số ngày:</label>
            <input
              placeholder="Số ngày"
              name="soNgay"
              value={form.soNgay}
              onChange={updateForm}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div>
            <label>Số chỗ tối đa:</label>
            <input
              placeholder="Số chỗ tối đa"
              name="soChoToiDa"
              value={form.soChoToiDa}
              onChange={updateForm}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Mô tả tour:</label>
          <textarea
            placeholder="Mô tả tour"
            name="moTa"
            value={form.moTa}
            onChange={updateForm}
            style={{ width: "100%", padding: "8px", minHeight: "80px" }}
          />
        </div>
      </div>

      {/* Lịch trình */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h2>Lịch Trình Tour</h2>
        
        {/* Search Component */}
        {currentEditingIndex !== null && (
          <div style={{ marginBottom: "15px", padding: "10px", background: "#f5f5f5", borderRadius: "5px" }}>
            <h4>Tìm kiếm địa điểm/dịch vụ:</h4>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                placeholder="Nhập tên địa điểm hoặc dịch vụ..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ flex: 1, padding: "8px" }}
              />
              <button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Đang tìm..." : "🔍 Tìm"}
              </button>
              <button onClick={() => setCurrentEditingIndex(null)}>❌ Hủy</button>
            </div>

            {/* Kết quả tìm kiếm */}
            {searchResults.length > 0 && (
              <div>
                <h5>Kết quả tìm kiếm ({searchResults.length}):</h5>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      style={{ 
                        padding: "8px", 
                        border: "1px solid #ccc", 
                        marginBottom: "5px", 
                        cursor: "pointer",
                        borderRadius: "3px"
                      }}
                      onClick={() => handleSelectItem(item, currentEditingIndex)}
                    >
                      {'ten_dd' in item ? (
                        <div>
                          <strong>📍 {item.ten_dd}</strong>
                        </div>
                      ) : (
                        <div>
                          <strong>🛎️ {item.ten_dv}</strong>
                          <br />
                          <small>💰 {item.don_gia.toLocaleString()} VND</small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danh sách nhà cung cấp (nếu đang chọn dịch vụ) */}
            {nhaCungCapList.length > 0 && (
              <div>
                <h5>Nhà cung cấp cho dịch vụ này:</h5>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {nhaCungCapList.map((ncc, idx) => (
                    <div
                      key={idx}
                      style={{ 
                        padding: "8px", 
                        border: "1px solid #ccc", 
                        marginBottom: "5px", 
                        cursor: "pointer",
                        borderRadius: "3px"
                      }}
                      onClick={() => handleSelectNhaCungCap(ncc, currentEditingIndex)}
                    >
                      <strong>🏢 {ncc.ten_ncc}</strong>
                      <br />
                      <small>📞 {ncc.sdt} | 📧 {ncc.email}</small>
                      <br />
                      <small>📍 {ncc.dia_chi}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Danh sách lịch trình */}
        {lichTrinh.map((lt, idx) => (
          <div
            key={idx}
            style={{ 
              padding: "15px", 
              border: "1px solid #ccc", 
              marginBottom: "10px", 
              borderRadius: "5px",
              background: "#f9f9f9"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h4 style={{ margin: 0 }}>Mục {idx + 1}</h4>
              <button 
                onClick={() => removeLichTrinh(idx)}
                style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "3px" }}
              >
                Xóa
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              <div>
                <button 
                  onClick={() => startSearch(idx)}
                  style={{ width: "100%", padding: "8px", background: "#007bff", color: "white", border: "none", borderRadius: "3px" }}
                >
                  {lt.loai === "dd" ? "📍 Chọn Địa Điểm" : "🛎️ Chọn Dịch Vụ"}
                </button>
              </div>
              
              <div>
                <select
                  value={lt.loai}
                  onChange={(e) => updateLichTrinh(idx, "loai", e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option value="dd">📍 Địa điểm</option>
                  <option value="dv">🛎️ Dịch vụ</option>
                </select>
              </div>
            </div>

            {/* Hiển thị thông tin đã chọn */}
            <div style={{ marginTop: "10px" }}>
              {lt.loai === "dd" && lt.ten_dd && (
                <div style={{ padding: "8px", background: "#e7f3ff", borderRadius: "3px" }}>
                  <strong>📍 Đã chọn:</strong> {lt.ten_dd}
                </div>
              )}
              
              {lt.loai === "dv" && lt.ten_dv && (
                <div>
                  <div style={{ padding: "8px", background: "#fff3cd", borderRadius: "3px", marginBottom: "5px" }}>
                    <strong>🛎️ Dịch vụ:</strong> {lt.ten_dv}
                    {lt.don_gia && <span style={{float: 'right'}}>💰 {lt.don_gia.toLocaleString()} VND</span>}
                  </div>
                  {lt.ten_ncc && (
                    <div style={{ padding: "8px", background: "#d4edda", borderRadius: "3px" }}>
                      <strong>🏢 Nhà cung cấp:</strong> {lt.ten_ncc}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginTop: "10px" }}>
              <label>Ghi chú:</label>
              <input
                placeholder="Ghi chú cho điểm này..."
                value={lt.moTa}
                onChange={(e) => updateLichTrinh(idx, "moTa", e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          </div>
        ))}

        <button 
          onClick={addLichTrinh}
          style={{ 
            padding: "10px 15px", 
            background: "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            marginTop: "10px"
          }}
        >
          ➕ Thêm điểm trong lịch trình
        </button>
      </div>

      {/* Lịch khởi hành */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h2>Lịch Khởi Hành</h2>
        {lichKhoiHanh.map((kh, idx) => (
          <div
            key={idx}
            style={{ 
              padding: "15px", 
              border: "1px solid #ccc", 
              marginBottom: "10px", 
              borderRadius: "5px",
              background: "#f9f9f9"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h4 style={{ margin: 0 }}>Lịch trình {idx + 1}</h4>
              <button 
                onClick={() => removeLichKhoiHanh(idx)}
                style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "3px" }}
              >
                Xóa
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <label>Ngày khởi hành:</label>
                <input
                  type="date"
                  value={kh.ngayKhoiHanh}
                  onChange={(e) => updateLichKhoiHanh(idx, "ngayKhoiHanh", e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div>
                <label>Ngày kết thúc:</label>
                <input
                  type="date"
                  value={kh.ngayKetThuc}
                  onChange={(e) => updateLichKhoiHanh(idx, "ngayKetThuc", e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div>
                <label>Số chỗ:</label>
                <input
                  placeholder="Số chỗ"
                  value={kh.soCho}
                  onChange={(e) => updateLichKhoiHanh(idx, "soCho", e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
            </div>
          </div>
        ))}
        <button 
          onClick={addLichKhoiHanh}
          style={{ 
            padding: "10px 15px", 
            background: "#17a2b8", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            marginTop: "10px"
          }}
        >
          📅 Thêm lịch khởi hành
        </button>
      </div>

      {/* Nút submit */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={submit}
          style={{ 
            padding: "12px 30px", 
            background: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          🚀 Tạo Tour
        </button>
      </div>

      
      
    </div>
  );
}