import React, { useState, useEffect } from 'react';

interface Tour {
  maTour: string;
  tenTour: string;
  diemKhoiHanh: string;
  diemDen: string;
  soNgay: number;
  soChoToiDa: number;
  giaTour: number;
  trangThai: boolean;
  ngayTao: string;
  tongChoConLai: number;
  soLuong: number;
  tinhTrang: string;
  anhTour?: string;
  moTa?: string;
}

interface LichTrinhDto {
  loai: string;
  moTa: string;
  tenDiaDiem: string | null;
  tenDichVu: string | null;
}

interface LichKhoiHanhDto {
  idLich: number;
  ngayKhoiHanh: string;
  ngayKetThuc: string;
  soChoConLai: number;
}

interface TourDetail {
  maTour: string;
  tenTour: string;
  diemKhoiHanh: string;
  tenDiaDiemDen: string | null;
  moTa: string;
  soNgay: number;
  soChoToiDa: number;
  giaTour: number;
  trangThai: boolean;
  ngayTao: string;
  lichTrinh: LichTrinhDto[];
  lichKhoiHanh: LichKhoiHanhDto[];
  anhTour?: string;
}

type FilterType = 'all' | 'available' | 'full' | 'hidden';

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

const fetchAllTours = async (): Promise<Tour[]> => {
  const url = `/api/thong-ke/all-tours`;
  const res = await fetch(url, {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return await res.json();
};

const fetchTourDetail = async (maTour: string): Promise<TourDetail> => {
  const url = `/api/tour/${maTour}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return await res.json();
};

const toggleTourStatus = async (maTour: string): Promise<any> => {
  const url = `/api/thong-ke/toggle-tour-status/${maTour}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return await res.json();
};

const updateTour = async (maTour: string, payload: any): Promise<any> => {
  const url = `http://localhost:8080/api/tour/update-full/${maTour}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return await res.json();
};

const AdminTourManagement: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTour, setSelectedTour] = useState<TourDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<TourForm>({
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

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await fetchAllTours();
      setTours(data);
    } catch (error) {
      console.error('Error loading tours:', error);
      alert('Không thể tải danh sách tour');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (maTour: string): Promise<void> => {
    try {
      setDetailLoading(true);
      const detail = await fetchTourDetail(maTour);
      setSelectedTour(detail);
    } catch (error) {
      console.error('Error loading tour detail:', error);
      alert('Không thể tải chi tiết tour');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleStatus = async (maTour: string): Promise<void> => {
    if (!confirm('Bạn có chắc muốn thay đổi trạng thái tour này?')) {
      return;
    }
    
    try {
      await toggleTourStatus(maTour);
      await loadTours();
      alert('Đã cập nhật trạng thái tour');
    } catch (error) {
      console.error('Error toggling tour status:', error);
      alert('Không thể cập nhật trạng thái tour');
    }
  };

  const handleEditClick = async (maTour: string, e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    try {
      const detail = await fetchTourDetail(maTour);
      setEditForm({
        maTour: detail.maTour,
        tenTour: detail.tenTour,
        diemKhoiHanh: detail.diemKhoiHanh,
        moTa: detail.moTa,
        soNgay: detail.soNgay.toString(),
        soChoToiDa: detail.soChoToiDa.toString(),
        giaTour: detail.giaTour.toString(),
        soLuong: "0", // Bạn cần thêm field này vào API nếu cần
        anhTour: detail.anhTour || "",
      });
      setPreviewImage(detail.anhTour ? `http://localhost:8080${detail.anhTour}` : "");
      setShowEditModal(true);
    } catch (error) {
      console.error('Error loading tour for edit:', error);
      alert('Không thể tải thông tin tour');
    }
  };

  const updateEditForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(' Vui lòng chọn file ảnh!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(' Ảnh không được vượt quá 5MB!');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:8080/api/tour/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const relativeUrl = await res.text();
        const fullUrl = "http://localhost:8080" + relativeUrl;
        setEditForm(prev => ({ ...prev, anhTour: fullUrl }));
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

    if (!editForm.tenTour.trim()) {
      newErrors.tenTour = "Tên tour không được để trống";
    }

    if (!editForm.diemKhoiHanh) {
      newErrors.diemKhoiHanh = "Điểm đến không được để trống";
    }

    if (!editForm.soNgay.trim()) {
      newErrors.soNgay = "Số ngày không được để trống";
    } else if (parseInt(editForm.soNgay) <= 0) {
      newErrors.soNgay = "Số ngày phải lớn hơn 0";
    }

    if (!editForm.soChoToiDa.trim()) {
      newErrors.soChoToiDa = "Số chỗ tối đa không được để trống";
    } else if (parseInt(editForm.soChoToiDa) <= 0) {
      newErrors.soChoToiDa = "Số chỗ tối đa phải lớn hơn 0";
    }

    if (!editForm.giaTour.trim()) {
      newErrors.giaTour = "Giá tour không được để trống";
    } else if (parseFloat(editForm.giaTour) <= 0) {
      newErrors.giaTour = "Giá tour phải lớn hơn 0";
    }

    if (!editForm.moTa.trim()) {
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

  const submitEdit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      maTour: editForm.maTour,
      tenTour: editForm.tenTour,
      diemKhoiHanh: editForm.diemKhoiHanh,
      diaDiemId: null,
      moTa: editForm.moTa,
      soNgay: parseInt(editForm.soNgay),
      soChoToiDa: parseInt(editForm.soChoToiDa),
      giaTour: parseFloat(editForm.giaTour),
      soLuong: parseInt(editForm.soLuong) || 0,
      trangThai: true,
      anhTour: editForm.anhTour || "",
      lichTrinh: [],
      lichKhoiHanh: []
    };

    try {
      await updateTour(editForm.maTour, payload);
      alert(" Cập nhật tour thành công!");
      setShowEditModal(false);
      await loadTours();
    } catch (e) {
      console.error("Lỗi:", e);
      alert(" Lỗi kết nối đến server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTours = tours.filter((tour: Tour) => {
    if (filter === 'all') return true;
    if (filter === 'available') return tour.soLuong > 0 && tour.trangThai;
    if (filter === 'full') return tour.soLuong === 0 && tour.trangThai;
    if (filter === 'hidden') return !tour.trangThai;
    return true;
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #007bff",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ color: "#666" }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "8px"
          }}>
            Quản Lý Tour
          </h1>
          <p style={{ color: "#666", margin: 0 }}>
            Xem và quản lý tất cả các tour du lịch
          </p>
        </div>

        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: "16px",
          marginBottom: "24px"
        }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { key: 'all' as FilterType, label: `Tất cả (${tours.length})`, color: '#007bff' },
              { key: 'available' as FilterType, label: `Đang Hoạt Động (${tours.filter(t => t.soLuong > 0 && t.trangThai).length})`, color: '#28a745' },
              { key: 'hidden' as FilterType, label: `Ngưng Hoạt Động (${tours.filter(t => !t.trangThai).length})`, color: '#6c757d' }
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  backgroundColor: filter === btn.key ? btn.color : "#f8f9fa",
                  color: filter === btn.key ? "white" : "#495057"
                }}
                onMouseOver={(e) => {
                  if (filter !== btn.key) {
                    e.currentTarget.style.backgroundColor = "#e9ecef";
                  }
                }}
                onMouseOut={(e) => {
                  if (filter !== btn.key) {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredTours.map((tour: Tour) => (
            <div
              key={tour.maTour}
              onClick={() => handleViewDetail(tour.maTour)}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "all 0.2s",
                opacity: !tour.trangThai ? 0.6 : 1,
                cursor: "pointer"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                background: "linear-gradient(to right, #007bff, #0056b3)",
                padding: "20px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: "13px",
                    margin: "0 0 8px 0",
                    opacity: 0.9,
                    fontWeight: "500"
                  }}>
                    Mã: {tour.maTour}
                  </p>
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: "0"
                  }}>
                    {tour.tenTour}
                  </h3>
                </div>
                <div style={{
                  textAlign: "right",
                  marginLeft: "20px"
                }}>
                  <p style={{
                    fontSize: "13px",
                    margin: "0 0 4px 0",
                    opacity: 0.9
                  }}>
                    Giá tour
                  </p>
                  <p style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    margin: 0
                  }}>
                    {formatCurrency(tour.giaTour)}
                  </p>
                </div>
              </div>

              <div style={{
                borderTop: "1px solid #f0f0f0",
                padding: "12px 20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px"
              }}>
                <button
                  onClick={(e) => handleEditClick(tour.maTour, e)}
                  style={{
                    padding: "6px 16px",
                    backgroundColor: "#ffc107",
                    color: "#000",
                    border: "1px solid #ffc107",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "13px",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffb300";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffc107";
                  }}
                >
                   Sửa
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(tour.maTour);
                  }}
                  style={{
                    padding: "6px 16px",
                    backgroundColor: tour.trangThai ? "#f8f9fa" : "#d4edda",
                    color: tour.trangThai ? "#6c757d" : "#155724",
                    border: "1px solid " + (tour.trangThai ? "#dee2e6" : "#c3e6cb"),
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "13px",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = tour.trangThai ? "#e9ecef" : "#c3e6cb";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = tour.trangThai ? "#f8f9fa" : "#d4edda";
                  }}
                  title={tour.trangThai ? 'Ẩn tour' : 'Hiện tour'}
                >
                  {tour.trangThai ? ' Ẩn' : ' Hiện'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "48px 20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <p style={{
              color: "#999",
              fontSize: "16px",
              margin: 0
            }}>
              Không có tour nào phù hợp với bộ lọc
            </p>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 1000,
              overflowY: "auto"
            }}
            onClick={() => setShowEditModal(false)}
          >
            <div 
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                maxWidth: "800px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                margin: "20px 0"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                padding: "24px",
                color: "#000",
                position: "sticky",
                top: 0,
                zIndex: 1
              }}>
                <h2 style={{ margin: "0 0 8px 0", fontSize: "22px" }}>
                  Chỉnh Sửa Tour
                </h2>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>
                  Mã tour: {editForm.maTour}
                </p>
              </div>

              <div style={{ padding: "30px" }}>
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
                      value={editForm.tenTour}
                      onChange={updateEditForm}
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
                      value={editForm.diemKhoiHanh}
                      onChange={updateEditForm}
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
                        value={editForm.soNgay}
                        onChange={updateEditForm}
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
                        value={editForm.soChoToiDa}
                        onChange={updateEditForm}
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
                        Số lượng tour
                      </label>
                      <input
                        placeholder="Số lượng tour có sẵn"
                        name="soLuong"
                        value={editForm.soLuong}
                        onChange={updateEditForm}
                        type="number"
                        min="0"
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "14px"
                        }}
                      />
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
                        value={editForm.giaTour}
                        onChange={updateEditForm}
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
                      value={editForm.moTa}
                      onChange={updateEditForm}
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

                </div>
              </div>

              <div style={{
                borderTop: "1px solid #e9ecef",
                padding: "16px 24px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                position: "sticky",
                bottom: 0,
                backgroundColor: "white"
              }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#5a6268"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6c757d"}
                >
                  Hủy
                </button>
                <button
                  onClick={submitEdit}
                  disabled={isSubmitting}
                  style={{
                    padding: "8px 20px",
                    background: isSubmitting ? "#ccc" : "#ffc107",
                    color: isSubmitting ? "#666" : "#000",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: isSubmitting ? "not-allowed" : "pointer"
                  }}
                  onMouseOver={(e) => {
                    if (!isSubmitting) e.currentTarget.style.background = "#ffb300";
                  }}
                  onMouseOut={(e) => {
                    if (!isSubmitting) e.currentTarget.style.background = "#ffc107";
                  }}
                >
                  {isSubmitting ? "Đang lưu..." : " Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedTour && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 1000
            }}
            onClick={() => setSelectedTour(null)}
          >
            <div 
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                maxWidth: "800px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {detailLoading ? (
                <div style={{ padding: "60px", textAlign: "center" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #007bff",
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    animation: "spin 1s linear infinite"
                  }}></div>
                  <p>Đang tải chi tiết...</p>
                </div>
              ) : (
                <>
                  <div style={{
                    background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                    padding: "24px",
                    color: "white",
                    position: "relative"
                  }}>
                    <button
                      onClick={() => setSelectedTour(null)}
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        padding: "6px 12px",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}
                    >
                      ✕
                    </button>
                    <h2 style={{ margin: "0 0 8px 0", fontSize: "22px" }}>
                      {selectedTour.tenTour}
                    </h2>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
                      Mã tour: {selectedTour.maTour}
                    </p>
                  </div>

                  <div style={{ padding: "24px" }}>
                    <div style={{ marginBottom: "24px" }}>
                      <h3 style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "12px"
                      }}>
                        Thông tin cơ bản
                      </h3>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px"
                      }}>
                        <div>
                          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 4px 0" }}>
                            Điểm đến
                          </p>
                          <p style={{ fontWeight: "500", margin: 0 }}>
                            {selectedTour.diemKhoiHanh}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 4px 0" }}>
                            Số ngày
                          </p>
                          <p style={{ fontWeight: "500", margin: 0 }}>
                            {selectedTour.soNgay} ngày
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 4px 0" }}>
                            Giá tour
                          </p>
                          <p style={{ fontWeight: "600", color: "#007bff", margin: 0 }}>
                            {formatCurrency(selectedTour.giaTour)}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 4px 0" }}>
                            Số chỗ tối đa
                          </p>
                          <p style={{ fontWeight: "500", margin: 0 }}>
                            {selectedTour.soChoToiDa} người
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 4px 0" }}>
                            Trạng thái
                          </p>
                          <p style={{
                            fontWeight: "500",
                            color: selectedTour.trangThai ? "#28a745" : "#dc3545",
                            margin: 0
                          }}>
                            {selectedTour.trangThai ? 'Đang hiển thị' : 'Đã ẩn'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedTour.moTa && (
                      <div style={{ marginBottom: "24px" }}>
                        <h3 style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#333",
                          marginBottom: "8px"
                        }}>
                          Mô tả
                        </h3>
                        <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>
                          {selectedTour.moTa}
                        </p>
                      </div>
                    )}

                    {selectedTour.lichTrinh && selectedTour.lichTrinh.length > 0 && (
                      <div style={{ marginBottom: "24px" }}>
                        <h3 style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#333",
                          marginBottom: "12px"
                        }}>
                          Lịch trình
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {selectedTour.lichTrinh.map((item: LichTrinhDto, index: number) => (
                            <div key={index} style={{
                              display: "flex",
                              alignItems: "start",
                              gap: "12px",
                              padding: "12px",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "6px"
                            }}>
                              <span style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: "#007bff",
                                color: "white",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "600",
                                flexShrink: 0
                              }}>
                                {index + 1}
                              </span>
                              <div style={{ flex: 1 }}>
                                <p style={{
                                  fontWeight: "500",
                                  margin: "0 0 4px 0"
                                }}>
                                  {item.tenDiaDiem || item.tenDichVu || 'Hoạt động'}
                                </p>
                                {item.moTa && (
                                  <p style={{
                                    fontSize: "13px",
                                    color: "#666",
                                    margin: 0
                                  }}>
                                    {item.moTa}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTour.lichKhoiHanh && selectedTour.lichKhoiHanh.length > 0 && (
                      <div>
                        <h3 style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#333",
                          marginBottom: "12px"
                        }}>
                          Lịch khởi hành
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {selectedTour.lichKhoiHanh.map((lich: LichKhoiHanhDto) => (
                            <div key={lich.idLich} style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "6px"
                            }}>
                              <div>
                                <p style={{ fontWeight: "500", margin: "0 0 4px 0" }}>
                                  {formatDate(lich.ngayKhoiHanh)} - {formatDate(lich.ngayKetThuc)}
                                </p>
                                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                                  Còn {lich.soChoConLai} chỗ
                                </p>
                              </div>
                              <span style={{
                                padding: "4px 12px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                backgroundColor: lich.soChoConLai > 0 ? "#d4edda" : "#f8d7da",
                                color: lich.soChoConLai > 0 ? "#155724" : "#721c24"
                              }}>
                                {lich.soChoConLai > 0 ? 'Còn chỗ' : 'Hết chỗ'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{
                    borderTop: "1px solid #e9ecef",
                    padding: "16px 24px",
                    display: "flex",
                    justifyContent: "flex-end"
                  }}>
                    <button
                      onClick={() => setSelectedTour(null)}
                      style={{
                        padding: "8px 20px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#5a6268"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6c757d"}
                    >
                      Đóng
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTourManagement;