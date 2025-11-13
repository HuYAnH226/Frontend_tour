import { useState } from "react";
import axios from "axios";

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

type LoginResponse = User | { error: string };

function Login() {
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState<Omit<User, "matKhau"> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setUserInfo(null);

    axios
      .post<LoginResponse>("http://localhost:8080/api/user/login", {
        tenDangNhap,
        matKhau,
      })
      .then((response) => {
        const data = response.data;

        if ("error" in data) {
          setMessage("❌ " + data.error);
        } else {
          // Lưu vào localStorage
          localStorage.setItem("user", JSON.stringify(data));

          setUserInfo(data);
          setMessage("✅ Đăng nhập thành công!");
        }
      })
      .catch(() => setMessage("❌ Không thể kết nối tới server."));
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "left" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <label>Tên đăng nhập:</label>
        <input
          type="text"
          name="tenDangNhap"
          value={tenDangNhap}
          onChange={(e) => setTenDangNhap(e.target.value)}
          required
        />

        <label>Mật khẩu:</label>
        <input
          type="password"
          name="matKhau"
          value={matKhau}
          onChange={(e) => setMatKhau(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            marginTop: "10px",
            background: "#28a745",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Đăng nhập
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      {userInfo && (
        <div style={{ marginTop: "20px" }}>
          <h3>Thông tin người dùng:</h3>
          <ul>
            <li>
              <strong>Mã User:</strong> {userInfo.maUser}
            </li>
            <li>
              <strong>Tên đăng nhập:</strong> {userInfo.tenDangNhap}
            </li>
            <li>
              <strong>Họ tên:</strong> {userInfo.hoTen}
            </li>
            <li>
              <strong>Email:</strong> {userInfo.email}
            </li>
            <li>
              <strong>SĐT:</strong> {userInfo.soDienThoai}
            </li>
            <li>
              <strong>CMND:</strong> {userInfo.soCmnd}
            </li>
            <li>
              <strong>Địa chỉ:</strong> {userInfo.diaChi}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Login;
