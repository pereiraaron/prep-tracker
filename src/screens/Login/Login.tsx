import { Box, Heading, VStack } from '@chakra-ui/react'
import { useSearchParams } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'

const Login = () => {
  const [searchParams] = useSearchParams()
  const isSignUp = searchParams.get('mode') === 'signup'

  return (
    <Box flex="1" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="400px" p={{ base: 4, md: 8 }}>
        <VStack gap={6}>
          <Heading size="lg">{isSignUp ? 'Sign Up' : 'Log In'}</Heading>
          <Box w="full">
            {isSignUp ? <SignUpForm /> : <LoginForm />}
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}

export default Login
