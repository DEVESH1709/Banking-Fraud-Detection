import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../components";
import { Lock, Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import useContextData from "../hooks/UseContextData";

const LoginPage = () => {
  const { context, handleKeyDown } = useContextData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, error, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, context);
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onKeyDown={handleKeyDown}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
          <div className="flex items-center mb-6">
            <Link
              to={"/forget-password"}
              className="text-sm text-violet-500 hover:underline"
            >
              Forget Password?
            </Link>
          </div>
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-violet-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
          >
            {isLoading ? <Loader className="animate-spin mx-auto" /> : "Login"}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-violet-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
