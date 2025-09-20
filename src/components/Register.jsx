// src/components/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";   // 👈 corregido

const Register = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      onRegisterSuccess(userCredential.user); // devuelve el usuario creado
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErro("Email já cadastrado.");
      } else if (err.code === "auth/weak-password") {
        setErro("A senha precisa ter pelo menos 6 caracteres.");
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Cadastro</h2>
      {erro && <p className="erro">{erro}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit">Criar conta</button>
      </form>
    </div>
  );
};

export default Register;
