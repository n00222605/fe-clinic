import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState(null); // State for backend errors

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setErrors({ message: "All fields are required." });
      return;
    }

    if (form.password.length < 8) {
      setErrors({ message: "Password must be at least 8 characters long." });
      return;
    }

    axios
      .post(`https://fed-medical-clinic-api.vercel.app/register`, form)
      .then((res) => {
        console.log("Registration successful:", res);

        localStorage.setItem("user", JSON.stringify(res.data.user));

        login(form.email, form.password);

        navigate("/");
      })
      .catch((err) => {
        console.error("Registration error:", err.response?.data || err);
        setErrors(err.response?.data || { message: "An error occurred." });
      });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form>
      {errors && <p style={{ color: "red" }}>{errors.message}</p>}
      <input
        onChange={handleChange}
        value={form.first_name}
        type="text"
        name="first_name"
        placeholder="First Name"
      />
      <br />
      <input
        onChange={handleChange}
        value={form.last_name}
        type="text"
        name="last_name"
        placeholder="Last Name"
      />
      <br />
      <input
        onChange={handleChange}
        value={form.email}
        type="email"
        name="email"
        placeholder="Email"
      />
      <br />
      <input
        onChange={handleChange}
        value={form.password}
        type="password"
        name="password"
        placeholder="Password"
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
};

export default RegisterForm;
