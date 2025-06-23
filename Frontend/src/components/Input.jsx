import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ icon: Icon, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative mb-6">
      {/* Left Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-violet-500" />
      </div>

      {/* Input Field */}
      <input
        {...props}
        type={isPassword && showPassword ? "text" : type}
        className="w-full pl-10 pr-10 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-violet-500 text-white placeholder-gray-400 transition duration-200"
      />

      {/* Right Eye Icon (Only for Password Fields) */}
      {isPassword && (
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={toggleShowPassword}
        >
          {showPassword ? (
            <EyeOff className="size-5 text-gray-400" />
          ) : (
            <Eye className="size-5 text-gray-400" />
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
