import { useState } from 'react'
import styles from './AuthPage.module.css'

interface Props {
  onGoToRegister: () => void
}

export default function LoginPage({ onGoToRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: integrar com backend
    console.log('Login:', { email, password })
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
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.btnPrimary}>
          Entrar
        </button>
      </form>

      <p className={styles.switchText}>
        Não tem uma conta?{' '}
        <button type="button" className={styles.btnLink} onClick={onGoToRegister}>
          Cadastre-se
        </button>
      </p>
    </div>
  )
}
