import { useState } from "react";
import axios from "axios";
import anh from "../../assets/du-lich-trai-nghiem.jpg";
import { Link } from "react-router-dom";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = (data: FormData): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,11}$/;

    if (!data.tenDangNhap.trim()) {
      newErrors.tenDangNhap = "Tên đăng nhập không được để trống.";
    } else if (data.tenDangNhap.length < 4) {
      newErrors.tenDangNhap = "Tên đăng nhập phải có ít nhất 4 ký tự.";
    }

    if (!data.matKhau.trim()) {
      newErrors.matKhau = "Mật khẩu không được để trống.";
    } else if (data.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!data.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống.";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Địa chỉ email không hợp lệ.";
    }

    if (!data.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại không được để trống.";
    } else if (!phoneRegex.test(data.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ (10-11 chữ số).";
    }

    if (!data.soCmnd.trim()) {
      newErrors.soCmnd = "Số CMND/CCCD không được để trống.";
    } else if (data.soCmnd.length < 9) {
      newErrors.soCmnd = "Số CMND/CCCD phải có ít nhất 9 ký tự.";
    }

    if (!data.diaChi.trim()) {
      newErrors.diaChi = "Địa chỉ không được để trống.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // 1. Run validation
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // 2. Check for errors. If there are any, stop submission.
    if (Object.keys(validationErrors).length > 0) {
      setMessage("❌ Vui lòng kiểm tra lại thông tin đăng ký.");
      return;
    }

    // 3. If valid, proceed with API call
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
      setErrors({}); // Clear errors on success
    } catch (error) {
      console.error(error);
      setMessage("❌ Đăng ký thất bại. Tên đăng nhập hoặc email đã tồn tại.");
    }
  };

  return (
    <>
      {/* Styles (unchanged for brevity) */}
      <style>{`
        body {
          object-fit: cover;
          background: url(${anh});
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
        .text-danger-glass {
            color: #ffcccc; /* Light red color for error text */
            margin-top: 0.25rem;
            margin-left: 1.5rem; /* Align with input padding */
            font-size: 0.85rem;
        }
      `}</style>
      <div className="container">
        <div className="register-card">
          <h1 className="register-title">Register</h1>

          {/* === Tên đăng nhập === */}
          <div className="mb-3">
            <input
              type="text"
              name="tenDangNhap"
              className={`form-control form-control-glass ${
                errors.tenDangNhap ? "is-invalid" : ""
              }`}
              placeholder="Tên đăng nhập"
              value={formData.tenDangNhap}
              onChange={handleChange}
            />
            {errors.tenDangNhap && (
              <div className="text-danger-glass">{errors.tenDangNhap}</div>
            )}
          </div>

          {/* === Mật khẩu === */}
          <div className="mb-3">
            <input
              type="password"
              name="matKhau"
              className={`form-control form-control-glass ${
                errors.matKhau ? "is-invalid" : ""
              }`}
              placeholder="Mật khẩu"
              value={formData.matKhau}
              onChange={handleChange}
            />
            {errors.matKhau && (
              <div className="text-danger-glass">{errors.matKhau}</div>
            )}
          </div>

          {/* === Họ tên === */}
          <div className="mb-3">
            <input
              type="text"
              name="hoTen"
              className={`form-control form-control-glass ${
                errors.hoTen ? "is-invalid" : ""
              }`}
              placeholder="Họ tên"
              value={formData.hoTen}
              onChange={handleChange}
            />
            {errors.hoTen && (
              <div className="text-danger-glass">{errors.hoTen}</div>
            )}
          </div>

          {/* === Email === */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className={`form-control form-control-glass ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="text-danger-glass">{errors.email}</div>
            )}
          </div>

          {/* === Số điện thoại === */}
          <div className="mb-3">
            <input
              type="text"
              name="soDienThoai"
              className={`form-control form-control-glass ${
                errors.soDienThoai ? "is-invalid" : ""
              }`}
              placeholder="Số điện thoại"
              value={formData.soDienThoai}
              onChange={handleChange}
            />
            {errors.soDienThoai && (
              <div className="text-danger-glass">{errors.soDienThoai}</div>
            )}
          </div>

          {/* === Số CMND === */}
          <div className="mb-3">
            <input
              type="text"
              name="soCmnd"
              className={`form-control form-control-glass ${
                errors.soCmnd ? "is-invalid" : ""
              }`}
              placeholder="Số CMND"
              value={formData.soCmnd}
              onChange={handleChange}
            />
            {errors.soCmnd && (
              <div className="text-danger-glass">{errors.soCmnd}</div>
            )}
          </div>

          {/* === Địa chỉ === */}
          <div className="mb-3">
            <input
              type="text"
              name="diaChi"
              className={`form-control form-control-glass ${
                errors.diaChi ? "is-invalid" : ""
              }`}
              placeholder="Địa chỉ"
              value={formData.diaChi}
              onChange={handleChange}
            />
            {errors.diaChi && (
              <div className="text-danger-glass">{errors.diaChi}</div>
            )}
          </div>

          <button onClick={handleSubmit} className="btn btn-register">
            Register
          </button>

          <p className="text-center mt-4 login-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login
            </Link>
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
