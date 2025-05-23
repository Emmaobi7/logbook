import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Register = () => {
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (password !== password2) return "Paswords dont match!"
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordErr = validatePassword(password);
    if (passwordErr) return setErr(passwordErr);
    setLoading(true)

    try {
      const res = await axios.post(`${baseURL}/auth/register`, {
        fullName,
        email,
        password,
      });

      // Store user and token in localStorage and AuthContext
      const user = res.data.user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      login(res.data.user);
      navigate("/student/dashboard");
    } catch (error) {
      console.log(error)
      setErr(error?.response?.data?.message || "Registration failed");
      setLoading(false)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {err && <p className="text-red-400 mb-2">{err}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="bg-white/10 p-3 rounded-lg text-white border border-white/30"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="bg-white/10 p-3 rounded-lg text-white border border-white/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-white/10 p-3 rounded-lg text-white border border-white/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="bg-white/10 p-3 rounded-lg text-white border border-white/30"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <p className="text-xs text-gray-400">
            Password must be at least 6 characters, contain upper & lowercase letters, and a number.
          </p>
          <button disabled={loading} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold transition">
            {loading ? "creating..." : "Register" }
          </button>
        </form>
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 underline">
            Login
          </a>
        </p>
      </GlassCard>
    </div>
  );
};

export default Register;
