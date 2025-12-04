import { useState } from "react";
import {
  fetchRevenueByTour,
  fetchInvoicesByTour
} from "../services/admin_revenuetour_api";

interface RevenueTour {
  maTour: string;
  tenTour: string;
  ngayTao: string;
  tongDoanhThu: number;
}

interface Invoice {
  idHoaDon: number;
  tenKhachHang: string;
  ngayGioKhoiHanh: string;
  soLuongKhach: number;
  tongTien: number;
}

export default function AdminTourRevenue() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tourList, setTourList] = useState<RevenueTour[]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [selectedTour, setSelectedTour] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleView = async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchRevenueByTour(startDate, endDate);
      setTourList(data);
      setInvoiceList([]);
      setSelectedTour("");
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTour = async (maTour: string) => {
    setLoading(true);
    setSelectedTour(maTour);
    try {
      const data = await fetchInvoicesByTour(maTour, startDate, endDate);
      setInvoiceList(data);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể tải hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh"
    }}>
      <h1 style={{ 
        textAlign: "center", 
        color: "#333", 
        marginBottom: "30px" 
      }}>
        Thống kê tour theo doanh thu
      </h1>

      <div style={{ 
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <div style={{ 
          display: "flex", 
          gap: "15px", 
          alignItems: "flex-end",
          flexWrap: "wrap"
        }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={{ 
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555"
            }}>
              Từ ngày <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <label style={{ 
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555"
            }}>
              Đến ngày <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
          </div>

          <button
            onClick={handleView}
            disabled={loading}
            style={{
              padding: "10px 24px",
              background: loading ? "#ccc" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = "#0056b3";
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = "#007bff";
            }}
          >
            {loading ? "Đang tải..." : "Xem thống kê"}
          </button>
        </div>
      </div>

      {tourList.length > 0 && (
        <div style={{ 
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}>
          <h2 style={{ 
            color: "#333", 
            marginBottom: "15px",
            fontSize: "20px",
            borderBottom: "2px solid #007bff",
            paddingBottom: "10px"
          }}>
            Danh sách tour
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              backgroundColor: "white"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Mã tour</th>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Tên tour</th>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Ngày tạo</th>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {tourList.map((item) => (
                  <tr
                    key={item.maTour}
                    onClick={() => handleSelectTour(item.maTour)}
                    style={{ 
                      cursor: "pointer",
                      backgroundColor: selectedTour === item.maTour ? "#e3f2fd" : "white",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTour !== item.maTour) {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTour !== item.maTour) {
                        e.currentTarget.style.backgroundColor = "white";
                      } else {
                        e.currentTarget.style.backgroundColor = "#e3f2fd";
                      }
                    }}
                  >
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px",
                      color: "#495057"
                    }}>{item.maTour}</td>
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px",
                      color: "#495057",
                      fontWeight: "500"
                    }}>{item.tenTour}</td>
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px",
                      color: "#495057"
                    }}>
                      {new Date(item.ngayTao).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px", 
                      textAlign: "right",
                      color: "#007bff",
                      fontWeight: "600"
                    }}>
                      {Number(item.tongDoanhThu).toLocaleString()} VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {invoiceList.length > 0 && (
        <div style={{ 
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ 
            color: "#333", 
            marginBottom: "15px",
            fontSize: "20px",
            borderBottom: "2px solid #28a745",
            paddingBottom: "10px"
          }}>
            Danh sách hóa đơn (Tour: {selectedTour})
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              backgroundColor: "white"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Mã HĐ</th>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Khách hàng</th>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Ngày Lập Hóa Đơn</th>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Số lượng khách</th>
                  <th style={{ 
                    border: "1px solid #dee2e6", 
                    padding: "12px",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#495057"
                  }}>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoiceList.map((inv) => (
                  <tr key={inv.idHoaDon}>
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px",
                      color: "#495057"
                    }}>{inv.idHoaDon}</td>
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px",
                      color: "#495057",
                      fontWeight: "500"
                    }}>{inv.tenKhachHang}</td>
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px",
                      color: "#495057"
                    }}>
                      {new Date(inv.ngayGioKhoiHanh).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px", 
                      textAlign: "center",
                      color: "#495057"
                    }}>
                      {inv.soLuongKhach}
                    </td>
                    <td style={{ 
                      border: "1px solid #dee2e6", 
                      padding: "12px", 
                      textAlign: "right",
                      color: "#28a745",
                      fontWeight: "600"
                    }}>
                      {Number(inv.tongTien).toLocaleString()} VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}