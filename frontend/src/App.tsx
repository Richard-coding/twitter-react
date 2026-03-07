import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

type Page = 'login' | 'register'

function App() {
  const [page, setPage] = useState<Page>('login')

  return (
    <>
      {page === 'login' && (
        <LoginPage onGoToRegister={() => setPage('register')} />
      )}
      {page === 'register' && (
        <RegisterPage onGoToLogin={() => setPage('login')} />
      )}
    </>
  )
}

export default App
