import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import authService from "../services/auth.service";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      if (password !== confirm) {
        toast.error("As senhas não coincidem", { id: "register" });
        return;
      }
      toast.loading("Registrando...", { id: "register" });
      await authService.register({ name, email, password });
      toast.success("Sua conta foi criada", { id: "register" });

      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message, { id: "register" });
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.logo}>𝕏</div>
      <h1 className={styles.title}>Criar conta</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirm">Confirmar senha</label>
          <input
            id="confirm"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.btnPrimary}>
          Cadastrar
        </button>
      </form>

      <p className={styles.switchText}>
        Já tem uma conta?{" "}
        <button
          type="button"
          className={styles.btnLink}
          onClick={() => navigate("/login")}
        >
          Entrar
        </button>
      </p>
    </div>
  );
}
