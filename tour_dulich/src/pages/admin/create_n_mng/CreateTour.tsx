import { useState } from "react";
import type { ChangeEvent } from "react";

type TourForm = {
  maTour: string;
  tenTour: string;
  diemKhoiHanh: string;
  moTa: string;
  soNgay: string;
  soChoToiDa: string;
  giaTour: string;
  soLuong: string;
  anhTour: string;
};

export default function CreateTourWithImage() {
  const [form, setForm] = useState<TourForm>({
    maTour: "",
    tenTour: "",
    diemKhoiHanh: "",
    moTa: "",
    soNgay: "",
    soChoToiDa: "",
    giaTour: "",
    soLuong: "",
    anhTour: "",
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [result, setResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const tinhThanhVietNam = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
    "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
    "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
    "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
    "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
    "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
    "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
    "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
    "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ];

  const updateForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Kiểm tra loại file
  if (!file.type.startsWith('image/')) {
    alert(' Vui lòng chọn file ảnh!');
    return;
  }

  // Kiểm tra kích thước (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert(' Ảnh không được vượt quá 5MB!');
    return;
  }

  setIsUploading(true);

  try {
    // Preview ảnh
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);

    // Upload lên server
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:8080/api/tour/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      // Backend trả về /uploads/tours/xxx.jpg
      const relativeUrl = await res.text();
      console.log("Relative:", relativeUrl);

      // FE cần URL đầy đủ
      const fullUrl = "http://localhost:8080" + relativeUrl;
      console.log("Full URL:", fullUrl);

      setForm(prev => ({ ...prev, anhTour: fullUrl }));

      alert(' Upload ảnh thành công!');
    } else {
      alert(' Lỗi upload ảnh');
      setPreviewImage('');
    }
  } catch (error) {
    console.error('Lỗi upload:', error);
    alert(' Lỗi kết nối khi upload ảnh');
    setPreviewImage('');
  } finally {
    setIsUploading(false);
  }
};


  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!form.tenTour.trim()) {
      newErrors.tenTour = "Tên tour không được để trống";
    }

    if (!form.diemKhoiHanh) {
      newErrors.diemKhoiHanh = "Điểm đến không được để trống";
    }

    if (!form.soNgay.trim()) {
      newErrors.soNgay = "Số ngày không được để trống";
    } else if (parseInt(form.soNgay) <= 0) {
      newErrors.soNgay = "Số ngày phải lớn hơn 0";
    }

    if (!form.soChoToiDa.trim()) {
      newErrors.soChoToiDa = "Số chỗ tối đa không được để trống";
    } else if (parseInt(form.soChoToiDa) <= 0) {
      newErrors.soChoToiDa = "Số chỗ tối đa phải lớn hơn 0";
    }

    if (!form.giaTour.trim()) {
      newErrors.giaTour = "Giá tour không được để trống";
    } else if (parseFloat(form.giaTour) <= 0) {
      newErrors.giaTour = "Giá tour phải lớn hơn 0";
    }

    if (!form.soLuong.trim()) {
      newErrors.soLuong = "Số lượng tour không được để trống";
    } else if (parseInt(form.soLuong) < 0) {
      newErrors.soLuong = "Số lượng tour không được âm";
    }

    if (!form.moTa.trim()) {
      newErrors.moTa = "Mô tả không được để trống";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join('\n');
      alert(" Vui lòng sửa các lỗi sau:\n" + errorMessages);
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      maTour: form.maTour || "",
      tenTour: form.tenTour,
      diemKhoiHanh: form.diemKhoiHanh,
      diaDiemId: null,
      moTa: form.moTa,
      soNgay: parseInt(form.soNgay),
      soChoToiDa: parseInt(form.soChoToiDa),
      giaTour: parseFloat(form.giaTour),
      soLuong: parseInt(form.soLuong),
      trangThai: true,
      anhTour: form.anhTour || "",
      lichTrinh: [],
      lichKhoiHanh: []
    };

    console.log("Payload gửi đi:", payload);

    try {
      const res = await fetch("http://localhost:8080/api/tour/create-full", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      console.log("Response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { success: true, message: "Tạo tour thành công", raw: responseText };
      }

      setResult(data);
      
      if (res.ok) {
        alert(" Tạo tour thành công!");
        setForm({
          maTour: "",
          tenTour: "",
          diemKhoiHanh: "",
          moTa: "",
          soNgay: "",
          soChoToiDa: "",
          giaTour: "",
          soLuong: "",
          anhTour: "",
        });
        setPreviewImage("");
      } else {
        alert(` Lỗi ${res.status}: ${JSON.stringify(data)}`);
      }

    } catch (e) {
      console.error("Lỗi:", e);
      setResult({ error: "Lỗi kết nối" });
      alert(" Lỗi kết nối đến server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "10px",
          fontSize: "28px"
        }}>
          Tạo Tour Mới
        </h1>
        <p style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "30px"
        }}>
          Nhập thông tin chi tiết để tạo tour du lịch mới
        </p>

        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "30px"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Upload ảnh */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#555"
              }}>
                Ảnh tour 
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: isUploading ? "not-allowed" : "pointer"
                }}
              />
              {isUploading && (
                <span style={{ color: "#007bff", fontSize: "12px", marginTop: "5px", display: "block" }}>
                  ⏳ Đang upload...
                </span>
              )}
              {previewImage && (
                <div style={{ marginTop: "10px" }}>
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      border: "2px solid #ddd"
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tên tour */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#555"
              }}>
                Tên tour <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                placeholder="Nhập tên tour"
                name="tenTour"
                value={form.tenTour}
                onChange={updateForm}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.tenTour ? '#dc3545' : '#ddd'}`,
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxShadow: errors.tenTour ? '0 0 0 2px rgba(220, 53, 69, 0.25)' : 'none'
                }}
              />
              {errors.tenTour && (
                <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", display: "block" }}>
                  {errors.tenTour}
                </span>
              )}
            </div>

            {/* Điểm đến */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#555"
              }}>
                Điểm đến <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <select
                name="diemKhoiHanh"
                value={form.diemKhoiHanh}
                onChange={updateForm}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.diemKhoiHanh ? '#dc3545' : '#ddd'}`,
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxShadow: errors.diemKhoiHanh ? '0 0 0 2px rgba(220, 53, 69, 0.25)' : 'none',
                  backgroundColor: "white"
                }}
              >
                <option value="">-- Chọn điểm đến --</option>
                {tinhThanhVietNam.map((tinhThanh) => (
                  <option key={tinhThanh} value={tinhThanh}>
                    {tinhThanh}
                  </option>
                ))}
              </select>
              {errors.diemKhoiHanh && (
                <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", display: "block" }}>
                  {errors.diemKhoiHanh}
                </span>
              )}
            </div>

            {/* Row: Số ngày & Số chỗ */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#555"
                }}>
                  Số ngày <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  placeholder="Số ngày"
                  name="soNgay"
                  value={form.soNgay}
                  onChange={updateForm}
                  type="number"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${errors.soNgay ? '#dc3545' : '#ddd'}`,
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxShadow: errors.soNgay ? '0 0 0 2px rgba(220, 53, 69, 0.25)' : 'none'
                  }}
                />
                {errors.soNgay && (
                  <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", display: "block" }}>
                    {errors.soNgay}
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#555"
                }}>
                  Số chỗ tối đa <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  placeholder="Số chỗ tối đa"
                  name="soChoToiDa"
                  value={form.soChoToiDa}
                  onChange={updateForm}
                  type="number"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${errors.soChoToiDa ? '#dc3545' : '#ddd'}`,
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxShadow: errors.soChoToiDa ? '0 0 0 2px rgba(220, 53, 69, 0.25)' : 'none'
                  }}
                />
                {errors.soChoToiDa && (
                  <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", display: "block" }}>
                    {errors.soChoToiDa}
                  </span>
                )}
              </div>
            </div>

            {/* Row: Số lượng tour & Giá tour */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#555"
                }}>
                  Số lượng tour <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  placeholder="Số lượng tour có sẵn"
                  name="soLuong"
                  value={form.soLuong}
                  onChange={updateForm}
                  type="number"
                  min="0"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${errors.soLuong ? '#dc3545' : '#ddd'}`,
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxShadow: errors.soLuong ? '0 0 0 2px rgba(220, 53, 69, 0.25)' : 'none'
                  }}
                />
                {errors.soLuong && (
                  <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", display: "block" }}>
                    {errors.soLuong}
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#555"
                }}>
                  Giá tour (VND) <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  placeholder="Giá tour"
                  name="giaTour"
                  value={form.giaTour}
                  onChange={updateForm}
                  type="number"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${errors.giaTour ? '#dc3545' : '#ddd'}`,
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxShadow: errors.giaTour ? '0 0 0 2px rgba(220, 53, 69, 0.25)' : 'none'
                  }}
                />
                {errors.giaTour && (
                  <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", display: "block" }}>
                    {errors.giaTour}
                  </span>
                )}
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#555"
              }}>
                Mô tả <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <textarea
                placeholder="Nhập mô tả chi tiết về tour"
                name="moTa"
                value={form.moTa}
                onChange={updateForm}
                rows={5}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.moTa ? '#dc3545' : '#ddd'}`,
                  borderRadius: "4px",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "Arial, sans-serif",
                  boxShadow: errors.moTa ? '0 0 0 2px rgba(220, 53, 69, 0.25)' : 'none'
                }}
              />
              {errors.moTa && (
                <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", display: "block" }}>
                  {errors.moTa}
                </span>
              )}
            </div>

            {/* Button */}
            <button
              onClick={submit}
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                background: isSubmitting ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                marginTop: "10px"
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) e.currentTarget.style.background = "#0056b3";
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) e.currentTarget.style.background = "#007bff";
              }}
            >
              {isSubmitting ? "Đang tạo..." : " Tạo Tour"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}