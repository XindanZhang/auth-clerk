import { useClerk } from '@clerk/clerk-expo'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

export const SignOutButton = ({ label = 'Sign out' }: { label?: string }) => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Internal navigation should use the router to preserve history and animations
      router.replace('/sign-in')
      
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }
  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#d32f2f',
    fontWeight: '600',
  },
})