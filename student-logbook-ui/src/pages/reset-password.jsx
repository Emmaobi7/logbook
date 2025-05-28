import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import GlassCard from "../components/GlassCard";
import logo from '../assets/wapcp2-removebg-preview.png';

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    if (!tokenFromURL) {
      setErr("Invalid or missing token.");
    } else {
      setToken(tokenFromURL);
    }
  }, [location.search]);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (pwd !== password2) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordErr = validatePassword(password);
    if (passwordErr) return setErr(passwordErr);
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/auth/reset-password`, {
        token,
        newPassword: password,
      });

      setMessage("Password reset successful. You can now login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen orange-gradient-bg text-black flex items-center justify-center">
      <GlassCard>
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
  <img src={logo} alt="Logo" className="mx-auto w-20 h-auto mb-2" />
  <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white text-center leading-snug">
    West African Postgraduate College of Pharmacists
  </h1>
  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-center">
    Student Log Book Portal
  </p>
</div>

        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {err && <p className="text-red-400 mb-2">{err}</p>}
        {message && <p className="text-green-400 mb-2">{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="bg-white/10 p-3 rounded-lg text-white border border-white/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="bg-white/10 p-3 rounded-lg text-white border border-white/30"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <p className="text-xs text-gray-400">
            Password must be at least 6 characters, contain upper & lowercase letters, and a number.
          </p>
          <button disabled={loading} className="text-white bg-gray-50 dark:bg-gray-900 hover:bg-gray-950 p-3 rounded-lg font-semibold transition">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <p className="text-sm mt-4">
          Back to{" "}
          <a href="/login" className="text-blue-400 underline">
            Login
          </a>
        </p>
      </GlassCard>
    </div>
  );
};

export default ResetPassword;
