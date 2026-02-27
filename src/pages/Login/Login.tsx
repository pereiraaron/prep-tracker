import { useSearchParams } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'

const Login = () => {
  const [searchParams] = useSearchParams()
  const isSignUp = searchParams.get('mode') === 'signup'

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-100 p-4 md:p-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">{isSignUp ? 'Sign Up' : 'Log In'}</h1>
          <div className="w-full">
            {isSignUp ? <SignUpForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
