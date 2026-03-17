import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMsg("✅ Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Registration failed"));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name"
            onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required />

          <input type="email" name="email" placeholder="Email"
            onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required />

          <input type="password" name="password" placeholder="Password"
            onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required />

          <select name="role" onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">
            Register
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-2">{msg}</p>
      </div>
    </div>
  );
}
