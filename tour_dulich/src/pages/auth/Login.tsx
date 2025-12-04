import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface User {
  maUser: number;
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  soCmnd: string;
  diaChi: string;
}

export default function Login() {
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // ====== TÀI KHOẢN ADMIN MẶC ĐỊNH ======
  if (tenDangNhap === "admin" && matKhau === "123") {
    const adminUser = {
      maUser: 0,
      tenDangNhap: "admin",
      hoTen: "Quản trị viên",
      email: "admin@example.com",
      soDienThoai: "0000000000",
      soCmnd: "000000000",
      diaChi: "Hệ thống",
    };

    localStorage.setItem("userInfo", JSON.stringify(adminUser));

    alert("✅ Đăng nhập ADMIN thành công!");
    navigate("/admin");

    return; // Ngăn gọi API backend
  }

  // ====== NẾU KHÔNG PHẢI ADMIN, GỌI API NHƯ BÌNH THƯỜNG ======
    try {
      const response = await axios.post<User>(
        "http://localhost:8080/api/user/login",
        { tenDangNhap, matKhau }
      );

      if ((response.data as any).error) {
        // Thay đổi: Dùng alert cho lỗi từ server
        alert("❌ " + (response.data as any).error);
        return;
      }

      setUserInfo(response.data);
      alert("✅ Đăng nhập thành công!"); // Giữ lại message cho thành công
      navigate("/");

      const safeUser = {
        maUser: response.data.maUser,
        hoTen: response.data.hoTen,
        email: response.data.email,
        soDienThoai: response.data.soDienThoai,
        soCmnd: response.data.soCmnd,
        diaChi: response.data.diaChi,
        tenDangNhap: response.data.tenDangNhap,
      };
      localStorage.setItem("userInfo", JSON.stringify(safeUser));
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Thay đổi: Dùng alert cho lỗi 401
        alert("❌ Tên đăng nhập hoặc mật khẩu không đúng!");
      } else {
        // Thay đổi: Dùng alert cho lỗi kết nối
        alert("❌ Lỗi kết nối server!");
      }
      // Đặt lại message thành rỗng để ẩn thông báo cũ nếu có
      setMessage("");
    }
  };

  return (
    <>
      <style>{`
        body {
          background: url('https://trithuccongdong.net/wp-content/uploads/2025/08/du-lich-sinh-thai-ruong-bac-thang-cua-dan-toc-mien-nui-phia-bac.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .login-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          padding: 3rem;
          max-width: 450px;
          margin: 50px auto;
        }
        .login-title {
          color: white;
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-control-glass {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 0.8rem 1.5rem;
          color: white;
          padding-right: 3rem;
        }
        .form-control-glass::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .form-control-glass:focus {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
          color: white;
        }
        .input-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          pointer-events: none;
        }
        .btn-login {
          background: white;
          color: #667eea;
          border: none;
          border-radius: 50px;
          padding: 0.8rem;
          font-size: 1.1rem;
          font-weight: 600;
          width: 100%;
          margin-top: 1rem;
          transition: all 0.3s;
        }
        .btn-login:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .form-check-label, .forgot-link, .register-text {
          color: white;
        }
        .forgot-link:hover {
          color: white;
          text-decoration: underline;
        }
        .register-link {
          color: white;
          font-weight: 600;
          text-decoration: none;
        }
        .register-link:hover {
          color: white;
          text-decoration: underline;
        }
        .alert-glass {
          background: rgba(0, 0, 0, 0.2);
          border: none;
          border-radius: 15px;
          color: white;
        }
        .user-info-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          margin-top: 1.5rem;
          color: white;
        }
      `}</style>

      <div className="container">
        <div className="login-card">
          <h1 className="login-title">Login</h1>

          <div className="mb-3 position-relative">
            <input
              type="text"
              className="form-control form-control-glass"
              placeholder="Username"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
            />
            <span className="input-icon">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z" />
              </svg>
            </span>
          </div>

          <div className="mb-3 position-relative">
            <input
              type="password"
              className="form-control form-control-glass"
              placeholder="Password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
            />
            <span className="input-icon">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button onClick={handleSubmit} className="btn btn-login">
            Login
          </button>

          <p className="text-center mt-4 register-text">
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Register
            </Link>
          </p>

          {/* CHỈ HIỂN THỊ MESSAGE CHO TRƯỜNG HỢP THÀNH CÔNG */}
          {message && (
            <div className="alert alert-glass text-center mt-3">{message}</div>
          )}

          {userInfo && (
            <div className="user-info-card">
              <h5 className="mb-3">Thông tin người dùng:</h5>
              <p>
                <strong>Tên đăng nhập:</strong> {userInfo.tenDangNhap}
              </p>
              <p>
                <strong>Họ tên:</strong> {userInfo.hoTen}
              </p>
              <p>
                <strong>Email:</strong> {userInfo.email}
              </p>
              <p>
                <strong>SĐT:</strong> {userInfo.soDienThoai}
              </p>
              <p>
                <strong>CMND:</strong> {userInfo.soCmnd}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {userInfo.diaChi}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
