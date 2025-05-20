import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); // reset error on submit

    if (password.length < 6) {
    return setErr("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      return setErr("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      return setErr("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      return setErr("Password must contain at least one number");
    }

    try {
      await login(email, password);  // auth context handles API call, storage etc.
      navigate("/student/dashboard");
    } catch (error) {
      // error could come from context's login method
      setErr(error?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {err && <p className="text-red-400 mb-2">{err}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
          <p className="text-xs text-gray-400">
            Must be at least 6 characters, include uppercase, lowercase, and a number.
          </p>

          <button className="bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold transition">
            Login
          </button>
        </form>
        <p className="text-sm mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 underline">
            Register
          </a>
        </p>
      </GlassCard>
    </div>
  );
};

export default Login;
