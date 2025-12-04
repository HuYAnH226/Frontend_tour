import { useEffect, useState } from "react";
import { getUsers } from "../services/admin_user_api";

interface User {
  maUser: string;
  tenDangNhap: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Lỗi:", error);
        alert("Không thể tải danh sách khách hàng");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(user => 
    user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.tenDangNhap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.soDienThoai.includes(searchTerm)
  );

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5"
      }}>
        <p style={{ color: "#666", fontSize: "16px" }}>Đang tải dữ liệu...</p>
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
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "10px",
          fontSize: "28px"
        }}>
          Danh sách khách hàng
        </h1>
        <p style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "30px"
        }}>
          Quản lý thông tin khách hàng
        </p>

        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "20px",
          marginBottom: "20px"
        }}>
          <div style={{ maxWidth: "500px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#555"
            }}>
              Tìm kiếm khách hàng
            </label>
            <input
              type="text"
              placeholder="Tìm theo tên, email, tên đăng nhập hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
          </div>
          <div style={{
            marginTop: "15px",
            fontSize: "14px",
            color: "#666"
          }}>
            Tổng số khách hàng: <strong>{users.length}</strong> | 
            Đang hiển thị: <strong>{filteredUsers.length}</strong>
          </div>
        </div>

        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{
                    padding: "15px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057",
                    borderBottom: "2px solid #dee2e6",
                    whiteSpace: "nowrap"
                  }}>Mã KH</th>
                  <th style={{
                    padding: "15px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057",
                    borderBottom: "2px solid #dee2e6",
                    whiteSpace: "nowrap"
                  }}>Tên đăng nhập</th>
                  <th style={{
                    padding: "15px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057",
                    borderBottom: "2px solid #dee2e6"
                  }}>Họ tên</th>
                  <th style={{
                    padding: "15px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057",
                    borderBottom: "2px solid #dee2e6"
                  }}>Email</th>
                  <th style={{
                    padding: "15px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057",
                    borderBottom: "2px solid #dee2e6",
                    whiteSpace: "nowrap"
                  }}>Số điện thoại</th>
                  <th style={{
                    padding: "15px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#495057",
                    borderBottom: "2px solid #dee2e6"
                  }}>Địa chỉ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#666"
                    }}>
                      {searchTerm ? "Không tìm thấy khách hàng phù hợp" : "Chưa có khách hàng nào"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.maUser}
                      style={{
                        backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa"
                      }}
                    >
                      <td style={{
                        padding: "15px",
                        borderBottom: "1px solid #dee2e6",
                        color: "#495057",
                        fontWeight: "500"
                      }}>{user.maUser}</td>
                      <td style={{
                        padding: "15px",
                        borderBottom: "1px solid #dee2e6",
                        color: "#495057"
                      }}>{user.tenDangNhap}</td>
                      <td style={{
                        padding: "15px",
                        borderBottom: "1px solid #dee2e6",
                        color: "#495057",
                        fontWeight: "600"
                      }}>{user.hoTen}</td>
                      <td style={{
                        padding: "15px",
                        borderBottom: "1px solid #dee2e6",
                        color: "#007bff"
                      }}>{user.email}</td>
                      <td style={{
                        padding: "15px",
                        borderBottom: "1px solid #dee2e6",
                        color: "#495057"
                      }}>{user.soDienThoai}</td>
                      <td style={{
                        padding: "15px",
                        borderBottom: "1px solid #dee2e6",
                        color: "#495057"
                      }}>{user.diaChi}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}