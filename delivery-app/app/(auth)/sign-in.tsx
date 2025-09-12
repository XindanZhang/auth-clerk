import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import React from 'react'
import { Image } from 'expo-image'

WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 0, default: 0 }) as number}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Sign in to Delivery-app</Text>
        <Text style={styles.subheader}>Welcome back! Please sign in to continue.</Text>

        <TouchableOpacity style={styles.oauthButton} onPress={onGooglePress}>
          <Image source={require('@/assets/images/google-g-logo.png')} style={styles.oauthIcon} contentFit="contain" />
          <Text style={styles.oauthLabel}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.hr} />
          <Text style={styles.or}>or</Text>
          <View style={styles.hr} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailAddress}
            placeholder="Enter your email"
            onChangeText={(v) => setEmailAddress(v)}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(v) => setPassword(v)}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onSignInPress}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <Link href="/sign-up">
            <Text style={styles.footerLink}> Sign up</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111',
  },
  subheader: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
    color: '#6b7280',
  },
  oauthButton: {
    borderRadius: 10,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    backgroundColor: '#fff',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  oauthIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  oauthLabel: {
    color: '#111827',
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  hr: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  or: {
    color: '#6b7280',
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  primaryButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#6b7280',
  },
  footerLink: {
    color: '#111',
    fontWeight: '700',
  },
})