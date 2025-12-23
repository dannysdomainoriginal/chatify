import React, { useRef, useState, type FormEvent } from "react";
import AnimatedBorder from "@/components/AnimatedBorder";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  LoaderIcon,
  EyeClosedIcon,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLogin, type LoginInput } from "@/hooks/auth/useLogin";

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: logIn, isPending: isLoggingIn } = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    logIn(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <AnimatedBorder>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM ILLUSTRATION */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Connect anytime, anywhere
                  </h3>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM COLUMN */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* Heading Text */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400">Login to access your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        className="input"
                        placeholder="johndoe@gmail.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        ref={inputRef}
                      />
                      {passwordFocus &&
                        (!showPassword ? (
                          <EyeClosedIcon
                            className="auth-input-icon"
                            style={{
                              right: "0.75rem",
                              left: "auto",
                              cursor: "pointer",
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(true)}
                          />
                        ) : (
                          <Eye
                            className="auth-input-icon"
                            style={{
                              right: "0.75rem",
                              left: "auto",
                              cursor: "pointer",
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(false)}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account? Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedBorder>
      </div>
    </div>
  );
};

export default LoginPage;
