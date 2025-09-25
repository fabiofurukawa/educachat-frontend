// src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";   // 👈 corregido

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const fazerLogin = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      onLoginSuccess(userCredential.user); // devuelve el usuario logado
    } catch (err) {
      setErro("Email o contraseña inválidos");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={fazerLogin}>
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Tu contraseña"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        /><br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
