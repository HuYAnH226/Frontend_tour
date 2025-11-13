import { useState } from "react";
import axios from "axios";

interface FormData {
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  soCmnd: string;
  diaChi: string;
}

function Register() {
  const [formData, setFormData] = useState<FormData>({
    tenDangNhap: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDienThoai: "",
    soCmnd: "",
    diaChi: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:8080/api/user/register",
      formData
    );
    setMessage("Đăng ký thành công!");
    console.log("Kết quả:", response.data);
    setFormData({
      tenDangNhap: "",
      matKhau: "",
      hoTen: "",
      email: "",
      soDienThoai: "",
      soCmnd: "",
      diaChi: "",
    });
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "left" }}>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <label>Tên đăng nhập:</label>
        <input
          type="text"
          name="tenDangNhap"
          value={formData.tenDangNhap}
          onChange={handleChange}
          required
        />

        <label>Mật khẩu:</label>
        <input
          type="password"
          name="matKhau"
          value={formData.matKhau}
          onChange={handleChange}
          required
        />

        <label>Họ tên:</label>
        <input
          type="text"
          name="hoTen"
          value={formData.hoTen}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Số điện thoại:</label>
        <input
          type="text"
          name="soDienThoai"
          value={formData.soDienThoai}
          onChange={handleChange}
        />

        <label>Số CMND:</label>
        <input
          type="text"
          name="soCmnd"
          value={formData.soCmnd}
          onChange={handleChange}
        />

        <label>Địa chỉ:</label>
        <textarea
          name="diaChi"
          value={formData.diaChi}
          onChange={handleChange}
        />

        <button
          type="submit"
          style={{
            marginTop: "10px",
            background: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Đăng ký
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default Register;
