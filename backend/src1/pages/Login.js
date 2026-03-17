import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      if (res.user.role === "teacher") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold">Login</h2>
      <input
        className="border p-2 mt-4"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mt-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
