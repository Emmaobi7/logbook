import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from '../context/AuthContext';
import logo from '../assets/wapcp2-removebg-preview.png';


const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
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
      setLoading(true)
      await login(email, password);  // auth context handles API call, storage etc.
      const user = JSON.parse(localStorage.getItem("user")); // Get the stored user
      
      // Navigate based on role
      switch (user.role) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "supervisor":
          navigate("/supervisor/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (error) {
      // error could come from context's login method
      setErr(error?.message || "Login failed");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen orange-gradient-bg text-black flex items-center justify-center">
      <GlassCard className="bg-gray">
        <div className="flex flex-col items-center justify-center bg-gray-900 dark:bg-gray-950 hover:bg-gray-950 p-4">
          <img src={logo} alt="Logo" className="mx-auto w-20 h-auto mb-2" />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white text-center leading-snug">
            West African Postgraduate College of Pharmacists
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-center">
            Student Log Book Portal
          </p>
        </div>



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
          <p className="text-xs text-black-400">
            Must be at least 6 characters, include uppercase, lowercase, and a number.
          </p>

          <button disabled={loading} className="text-white bg-gray-900 dark:bg-gray-950 hover:bg-gray-950 p-3 rounded-lg font-semibold transition">
            { loading ? "hold on..." : "Login" } 
          </button>
        </form>
        <p className="text-sm mt-4">
          Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#de7225] underline hover:text-orange-600 transition duration-200"
        >
          Register
        </Link>

          <br />
          <Link
            to="/fp"
            className="text-[#de7225] underline hover:text-orange-600 transition duration-200"
          >
            Forgotten Password?
          </Link>

        </p>
      </GlassCard>
    </div>
  );
};

export default Login;
