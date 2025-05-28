import { useState } from "react";
import axios from "axios";
import GlassCard from "../components/GlassCard";
import logo from '../assets/wapcp2-removebg-preview.png';

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(`${baseURL}/auth/forgot-password`, { email });
      setSuccess("If this email is registered, a reset link has been sent.");
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to send reset email");
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

        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        {err && <p className="text-red-400 mb-2">{err}</p>}
        {success && <p className="text-green-400 mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-white/10 p-3 rounded-lg text-white border border-white/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="text-white bg-gray-50 dark:bg-gray-900 hover:bg-gray-950 p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-sm mt-4">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-400 underline">
            Login
          </a>
        </p>
      </GlassCard>
    </div>
  );
};

export default ForgotPassword;
