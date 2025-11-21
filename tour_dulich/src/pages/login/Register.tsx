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
    setMessage("");

    try {
      await axios.post("http://localhost:8080/api/user/register", formData);

      setMessage("✅ Đăng ký thành công!");

      // Reset form
      setFormData({
        tenDangNhap: "",
        matKhau: "",
        hoTen: "",
        email: "",
        soDienThoai: "",
        soCmnd: "",
        diaChi: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Đăng ký thất bại. Tên đăng nhập hoặc email đã tồn tại.");
    }
  };

  return (
    <>
      //{" "}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
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
        .register-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          padding: 3rem;
          max-width: 450px;
          margin: 50px auto;
        }
        .register-title {
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
          padding: 0.75rem 1.5rem;
          color: white;
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
        .btn-register {
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
        .btn-register:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .login-text {
          color: white;
        }
        .login-link {
          color: white;
          font-weight: 600;
          text-decoration: none;
        }
        .login-link:hover {
          color: white;
          text-decoration: underline;
        }
        .alert-glass {
          background: rgba(0, 0, 0, 0.2);
          border: none;
          border-radius: 15px;
          color: white;
        }
      `}</style>
      <div className="container">
        <div className="register-card">
          <h1 className="register-title">Register</h1>

          <div className="mb-3">
            <input
              type="text"
              name="tenDangNhap"
              className="form-control form-control-glass"
              placeholder="Tên đăng nhập"
              value={formData.tenDangNhap}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="matKhau"
              className="form-control form-control-glass"
              placeholder="Mật khẩu"
              value={formData.matKhau}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="hoTen"
              className="form-control form-control-glass"
              placeholder="Họ tên"
              value={formData.hoTen}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control form-control-glass"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="soDienThoai"
              className="form-control form-control-glass"
              placeholder="Số điện thoại"
              value={formData.soDienThoai}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="soCmnd"
              className="form-control form-control-glass"
              placeholder="Số CMND"
              value={formData.soCmnd}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="diaChi"
              className="form-control form-control-glass"
              placeholder="Địa chỉ"
              value={formData.diaChi}
              onChange={handleChange}
            />
          </div>

          <button onClick={handleSubmit} className="btn btn-register">
            Register
          </button>

          <p className="text-center mt-4 login-text">
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Login
            </a>
          </p>

          {message && (
            <div className="alert alert-glass text-center mt-3" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;
