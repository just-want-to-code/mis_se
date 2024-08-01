import { useAuth } from 'src/hooks/useAuth'

const navigation = () => {
  const { userMenu } = useAuth()
  const userm = [
    { title: 'Dashboard', path: '/home' },
    { title: 'Course Offer', path: '/course' }
  ]
  return Object.keys(userm).map(i => userm[i])
}

export default navigation
