import React, { useState } from "react";
import styles from "../css/Signup.module.css";
import { useDarkMode } from "./DarkModeContext";
import { Link } from "react-router-dom";
import Alert from "../components/UI Components/Alert.jsx";

const Signup = () => {
  const { darkMode } = useDarkMode();

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    department: "",
    semester: "",
    strengths: [],
    difficulties: [],
    studyStyle: "",
    availability: "",
  });

  const [picture, setPicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const subjects = [
    "DSA", "Web Development", "MAD", "Programming Fundamentals", "Artificial Intelligence",
    "C#", "Database Management", "Operating Systems", "Computer Networks",
    "Software Engineering", "Information Security", "Cyber Security",
    "Linear Algebra", "Calculus", "Statistics"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") calculatePasswordStrength(value);
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value),
    }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, studyStyle: e.target.value }));
  };

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Za-z]/.test(password) && /\d/.test(password)) score++;
    if (/[@$!%*?&#^()_\-+=]/.test(password)) score++;
    setPasswordStrength(score);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z ]{3,}$/;
    if (!nameRegex.test(formData.name)) {
      setError("Please enter a valid full name. Only letters allowed.");
      return false;
    }

    const rollRegex = /^[0-9]{8}-[0-9]{3}$/;
    if (!rollRegex.test(formData.rollNumber)) {
      setError("Roll number must be in the format 22034156-043.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    const strongPasswordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and include letters, numbers, and symbols."
      );
      return false;
    }

    if (formData.semester && !/^[0-9]+$/.test(formData.semester)) {
      setError("Semester must be a number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((val) => payload.append(key, val));
        } else {
          payload.append(key, formData[key]);
        }
      }

      if (picture) payload.append("picture", picture);

      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setFormData({
          name: "",
          rollNumber: "",
          email: "",
          password: "",
          department: "",
          semester: "",
          strengths: [],
          difficulties: [],
          studyStyle: "",
          availability: "",
        });
        setPicture(null);
        setPasswordStrength(0);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ""}`}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <svg
              className={styles.logoIcon}
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fill="currentColor"
                fillRule="evenodd"
                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
              />
            </svg>
            <h1 className={styles.logoText}>Collaborative Learning Partner System</h1>
          </div>

          <Link to="/login" className={styles.loginButton}>
            Login
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>

          {/* ALERTS */}
          {error && <Alert type="error" message={error} onClose={() => setError("")} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

          <div className={styles.formHeader}>
            <h2 className={styles.formHeaderTitle}>Student Registration &amp; Profile</h2>
            <p className={styles.formHeaderText}>
              Complete your profile to connect with the best study partners for you.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rollNumber" className={styles.label}>Roll Number</label>
                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 22034156-043"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="picture" className={styles.label}>Profile Picture</label>
                <input
                  id="picture"
                  name="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g., johndoe@gmail.com"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="********"
                    className={styles.input}
                    required
                  />
                  <button
                    type="button"
                    className={styles.showPasswordBtn}
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>

                {formData.password.length > 0 && (
                  <div className={styles.strengthWrapper}>
                    <div
                      className={`${styles.strengthBar} ${passwordStrength === 1
                        ? styles.weak
                        : passwordStrength === 2
                          ? styles.medium
                          : passwordStrength === 3
                            ? styles.strong
                            : ""
                        }`}
                    ></div>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="department" className={styles.label}>Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>


              <div className={styles.formGroup}>
                <label htmlFor="semester" className={styles.label}>Semester</label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>

            </div>

            <div className={styles.sectionDivider}><h3>Academic Profile</h3></div>
            <div className={styles.formGroup}>
              <label>Academic Strengths</label>
              <p className={styles.sectionDescription}>Select the subjects you excel in.</p>
              <div className={styles.checkboxGrid}>
                {subjects.map((subject) => (
                  <div className={styles.checkboxItem} key={`s-${subject}`}>
                    <input
                      type="checkbox"
                      id={`s-${subject}`}
                      value={subject}
                      checked={formData.strengths.includes(subject)}
                      onChange={(e) => handleCheckboxChange(e, "strengths")}
                    />
                    <label htmlFor={`s-${subject}`}>{subject}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Subjects of Difficulty</label>
              <p className={styles.sectionDescription}>Select subjects where you need help.</p>
              <div className={styles.checkboxGrid}>
                {subjects.map((subject) => (
                  <div className={styles.checkboxItem} key={`d-${subject}`}>
                    <input
                      type="checkbox"
                      id={`d-${subject}`}
                      value={subject}
                      checked={formData.difficulties.includes(subject)}
                      onChange={(e) => handleCheckboxChange(e, "difficulties")}
                    />
                    <label htmlFor={`d-${subject}`}>{subject}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sectionDivider}><h3>Learning Preferences</h3></div>
            <div className={styles.formGroup}>
              <label>Preferred Study Style</label>
              <div className={styles.radioGroup}>
                {[
                  { id: "individual", label: "Individual Study" },
                  { id: "group", label: "Group Collaboration" },
                  { id: "one-on-one", label: "One-on-One Mentoring" },
                ].map(({ id, label }) => (
                  <div className={styles.radioItem} key={id}>
                    <input
                      type="radio"
                      id={id}
                      name="studyStyle"
                      value={id}
                      checked={formData.studyStyle === id}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor={id}>{label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="availability">Availability</label>
              <p className={styles.sectionDescription}>
                Let others know when you're free to study.
              </p>
              <textarea
                id="availability"
                name="availability"
                rows={3}
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g., Weekday evenings after 6 PM, Weekends all day..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.submitButtonContainer}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Creating Profile..." : "Create Profile"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;
