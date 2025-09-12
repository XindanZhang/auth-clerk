import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({ emailAddress, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.screen}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          enableOnAndroid
          enableAutomaticScroll
          extraScrollHeight={24}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <Text style={styles.subheader}>Enter the code we sent to your email</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Verification code</Text>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Enter your verification code"
              onChangeText={(v) => setCode(v)}
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={onVerifyPress}>
            <Text style={styles.primaryButtonText}>Verify</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={8}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        keyboardDismissMode="on-drag"
        bounces
        alwaysBounceVertical
      >
        <Text style={styles.subheader}>Create your Delivery-app account</Text>

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
            placeholder="Create a password"
            secureTextEntry
            onChangeText={(v) => setPassword(v)}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onSignUpPress}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/sign-in">
            <Text style={styles.footerLink}> Sign in</Text>
          </Link>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    minHeight: '100%',
    justifyContent: 'center',
  },
  subheader: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
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