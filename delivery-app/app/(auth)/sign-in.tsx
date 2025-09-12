import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import React from 'react'

WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onGooglePress = async () => {
    try {
      const redirectUrl = Linking.createURL('/')
      const { createdSessionId, setActive: setActiveOauth } = await startOAuthFlow({ redirectUrl })
      if (createdSessionId && setActiveOauth) {
        await setActiveOauth({ session: createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={onGooglePress}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Link href="/sign-up">
          <Text style={styles.signUpText}>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  googleButton: {
    marginTop: 10,
    width: "100%",
    borderRadius: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    alignItems: "center",
  },
  googleButtonText: {
    color: "#202124",
    fontWeight: "600",
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    color: "grey",
  },
  signUpText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
  },
})