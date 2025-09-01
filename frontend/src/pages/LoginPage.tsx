import { useState, type FormEvent } from "react";
import { useAuthStore } from "../store/store"
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
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
    // if validation is passed then proceed login below
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
    <div className="">
      <h1>LoginPage</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="password">Password</label>
          <div className="flex items-center gap-2">
            <input
              id="password"
              type={isShowPassword ? "text" : "password"}
              placeholder="*****"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="button" onClick={() => setIsShowPassword(!isShowPassword)}>
              {isShowPassword ? <Eye size={24} className="size-5 text-base-content/40" /> : <EyeOff size={24} className="size-5 text-base-content/40" />}
            </button>
          </div>
        </div>
        <button className="btn btn-primary cursor-pointer" type="submit" disabled={isLoggingIn}>
          {isLoggingIn ?
            <div className="flex items-center gap-1">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Loading...
            </div> :
            "Sign In"}
        </button>
      </form>
      <div className="flex gap-2">
        <h1>Don't have an account?</h1>
        <Link to="/signup">Create an account</Link>
      </div>
    </div>
  )
}

export default LoginPage;