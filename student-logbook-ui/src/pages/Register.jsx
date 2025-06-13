import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/wapcp2-removebg-preview.png';

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Register = () => {
  const { login, register } = useAuth();
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
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return "Password must contain a special character";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordErr = validatePassword(password);
    if (passwordErr) return setErr(passwordErr);
    setLoading(true);

    try {
      await register({
        fullName,
        email,
        password,
      });
      
      // Navigate to dashboard after successful registration
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setErr(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen orange-gradient-bg text-black flex items-center justify-center">
      <GlassCard>
        <div className="flex flex-col items-center justify-center bg-gray-900 dark:bg-gray-950 p-4">
  <img src={logo} alt="Logo" className="mx-auto w-20 h-auto mb-2" />
  <h1 className="text-xl md:text-2xl font-semibold text-white dark:text-white text-center leading-snug">
    West African Postgraduate College of Pharmacists
  </h1>
  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-center">
    Student Log Book Portal
  </p>
</div>

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
           <p className="text-xs text-black-400">
            Must be at least 6 characters, include uppercase, lowercase, a number and a special character.
          </p>
          <button disabled={loading} className=" text-white bg-gray-900 hover:bg-gray-950 p-3 rounded-lg font-semibold transition">
            {loading ? "creating..." : "Register" }
          </button>
        </form>
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#de7225] underline hover:text-orange-600 transition duration-200"
          >
            Login
          </Link>

        </p>
      </GlassCard>
    </div>
  );
};

export default Register;
