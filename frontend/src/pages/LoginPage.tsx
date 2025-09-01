import { useState, type FormEvent } from "react";
import { useAuthStore } from "../store/store"
import { Eye, EyeOff, LoaderCircle, MessageSquareText } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function LoginPage() {
  const { login, isLoggingIn } = useAuthStore();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFormData() === true) return login(formData);
  }

  const validateFormData = (): boolean => {
    const formValidateData = [
      { valid: formData.email.trim(), message: "Email is required" },
      { valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), message: "Invalid email format" },
      { valid: formData.password.trim(), message: "Password is required" },
      { valid: formData.password.length >= 6, message: "Password must be atleast 6 characters" },
    ];
    for (const rule of formValidateData) {
      if (!rule.valid) {
        toast.error(rule.message);
        return false;
      }
    }
    return true;
  }

  return (
    <div className="flex">
      {/* right side */}
      <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <MessageSquareText className="text-primary size-16" />
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <h1>Sign in to continue</h1>
        </div>
        <form className="flex flex-col w-full max-w-3xl gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 px-4 md:px-0">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                className="w-full rounded-2xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary shadow-inner px-6 py-4 transition-all duration-200 placeholder-gray-400"
                id="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <div className="relative">
                <input
                  className="w-full rounded-2xl pr-12 bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary shadow-inner px-6 py-4 transition-all duration-200 placeholder-gray-400"
                  id="password"
                  type={isShowPassword ? "text" : "password"}
                  placeholder="*****"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  tabIndex={-1}
                  aria-label={isShowPassword ? 'Hide password' : 'Show password'}
                >
                  {isShowPassword ? <Eye size={24} className="size-5 text-primary" /> : <EyeOff size={24} className="size-5 text-primary" />}
                </button>
              </div>
            </div>
          </div>
          <button className="btn btn-primary cursor-pointer w-full" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ?
              <div className="flex items-center gap-1">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading...
              </div> :
              "Sign In"}
          </button>
        </form>
        <div className="flex gap-2">
          <p>Don't have an account?</p>
          <Link to="/signup">Create an account</Link>
        </div>
      </div>
      {/* left side */}
      <div className="hidden lg:flex w-full min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 p-8">
        <div className="flex flex-col items-center gap-4">
          <MessageSquareText className="size-20 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Chat. Connect. Discover.</h2>
          <p className="text-center text-gray-200/80 max-w-xs">Experience real-time conversations and make new friends in Hong Kong. Join MelloHK and be part of a vibrant community!</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;