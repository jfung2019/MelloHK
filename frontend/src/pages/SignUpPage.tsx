import { Eye, EyeOff, LoaderCircle, MessageSquareText } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/store";
import toast from "react-hot-toast";

function SignUpPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { signUp, isSigningUp } = useAuthStore();

  // validate the form input for the required fields
  const validateFormData = (): boolean => {
    const validations = [
      { valid: formData.email.trim(), message: "Email is required!" },
      { valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), message: "Invalid email format" },
      { valid: formData.name.trim(), message: "Name is required!" },
      { valid: formData.password, message: "Password is required!" },
      { valid: formData.password.length >= 6, message: "Password must be at least 6 characters" },
    ];
    for (const rule of validations) {
      if (!rule.valid) {
        toast.error(rule.message);
        return false;
      }
    }
    return true;
  };

  // handleSubmit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFormData() === true) return signUp(formData);
  }

  return (
    <div className="flex">
      <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <MessageSquareText className="text-primary size-16" />
          <h1 className="text-3xl font-bold">Welcome to MelloHK</h1>
          <h1>Where people can connect!</h1>
        </div>
        <form className="flex flex-col w-full max-w-3xl gap-4" onSubmit={handleSubmit}>
          <div className="">
            <div>
              <label htmlFor="name">Name</label>
              <input className="w-full rounded" id="name" type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <label htmlFor="email">Email</label>
            <input className="w-full rounded" id="email" type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                className="w-full rounded pr-10" id="password"
                type={isShowPassword ? "text" : "password"}
                placeholder="*****"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                tabIndex={-1}
                aria-label={isShowPassword ? 'Hide password' : 'Show password'}
              >
                {isShowPassword ? <Eye size={24} className="size-5 text-base-content/40" /> : <EyeOff size={24} className="size-5 text-base-content/40" />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary cursor-pointer w-full" type="submit" disabled={isSigningUp}>
            {isSigningUp ?
              <div className="flex items-center gap-1">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading...
              </div> :
              "Create Account"}
          </button>
        </form>
        <div className="flex gap-2">
          <p>Already have an account?</p>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 p-8">
        <div className="flex flex-col items-center gap-4">
          <MessageSquareText className="size-20 text-yellow-400" />
          <h2 className="text-2xl font-bold text-yellow-300">Chat. Connect. Discover.</h2>
          <p className="text-center text-gray-200/80 max-w-xs">Experience real-time conversations and make new friends in Hong Kong. Join MelloHK and be part of a vibrant community!</p>
        </div>
      </div>
            {/* <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-pink-200 via-red-100 to-yellow-100 p-8">
        <div className="flex flex-col items-center gap-4">
          <MessageSquareText className="size-20 text-pink-500" />
          <h2 className="text-2xl font-bold text-pink-700">Chat. Connect. Discover.</h2>
          <p className="text-center text-pink-900/80 max-w-xs">Experience real-time conversations and make new friends in Hong Kong. Join MelloHK and be part of a vibrant community!</p>
        </div>
      </div> */}
    </div>
  )
}

export default SignUpPage;