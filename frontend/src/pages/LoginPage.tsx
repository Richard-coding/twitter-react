import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import authService from "../services/auth.service";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      toast.loading("Logando...", { id: "login" });
      const response = await authService.login({ email, password });
      toast.success("Login feito com sucesso...", { id: "login" });

      localStorage.setItem(
        "user",
        JSON.stringify({
          accessToken: response.accessToken,
          ...response.user,
        }),
      );
      
      localStorage.setItem("accessToken", response.accessToken);

      navigate("/");
    } catch (error) {
      toast.error("Usuário ou senha errada...", { id: "login" });
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.logo}>𝕏</div>
      <h1 className={styles.title}>Entrar na sua conta</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.btnPrimary}>
          Entrar
        </button>
      </form>

      <p className={styles.switchText}>
        Não tem uma conta?{" "}
        <button
          type="button"
          className={styles.btnLink}
          onClick={() => navigate("/register")}
        >
          Cadastre-se
        </button>
      </p>
    </div>
  );
}
