import { useState } from "react";
import axios from "axios";
import GlassCard from "../components/GlassCard";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
      <GlassCard>
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
            className="bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold transition"
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
