import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Login.module.css";
import Loader from "../components/UI Components/Loader";
import { useDarkMode } from "./DarkModeContext";
import Alert from "../components/UI Components/Alert";

function Login() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clear localStorage
  useEffect(() => {
    const clearUserData = () => {
      localStorage.removeItem("user");
      setFormData({ email: "", password: "" });
    };
    clearUserData();
    window.addEventListener("pageshow", clearUserData);
    window.addEventListener("popstate", clearUserData);
    return () => {
      window.removeEventListener("pageshow", clearUserData);
      window.removeEventListener("popstate", clearUserData);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // show loader only

    // simulate 2-second loading before sending login request
    setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/website");
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }

      setLoading(false);
    }, 2000);
  };

  // Show only loader when loading
  if (loading) {
    return (
      <div className={styles.fullScreenLoader}>
        <Loader />
      </div>
    );
  }

  return (

    <div className={`${styles.container} ${darkMode ? styles.darkMode : ""}`}>
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}
      <div className={styles.brandingSection}>
        <div className={styles.brandingContent}>
          <div className={styles.logoContainer}>
            <div className={styles.loaderWrapper}>
              {/* <svg
                className={styles.logoSvg}
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg> */}
            </div>
          </div>

          <h1 className={styles.brandingTitle}>
            Collaborative Learning Partner System
          </h1>
          <p className={styles.brandingSubtitle}>
            Find your perfect study buddy and excel together.
          </p>
        </div>
      </div>

      <div className={styles.loginSection}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>Welcome</h2>
            <p className={styles.loginSubtitle}>
              Login to continue your learning journey.
            </p>
          </div>

          {error && <div className="errorMessage">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="email">
                Email
              </label>
              <input
                className={styles.formInput}
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="password">
                Password
              </label>
              <input
                className={styles.formInput}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i
                className={`${showPassword
                  ? "fa-regular fa-eye-slash"
                  : "fa-regular fa-eye"
                  } ${styles.toggleEye}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className={styles.formOptions}>
              <a className={styles.forgotPasswordLink} href="#">
                Forgot Password?
              </a>
            </div>

            <button className={styles.loginButton} type="submit">
              Login
            </button>
          </form>

          <div className={styles.signupPrompt}>
            <p className={styles.signupText}>
              Don't have an account?{" "}
              <Link to="/signup" className={styles.signupLink}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
