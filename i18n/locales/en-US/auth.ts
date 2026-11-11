export const auth = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Login to manage your store',
    emailOrUsername: 'Email or Username',
    emailPlaceholder: 'Enter email or username',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot Password?',
    forgotPasswordTitle: 'Reset Password',
    forgotPasswordMessage:
      'To reset your password, contact your store owner or manager. They can update it for you from staff profiles.',
    noAccount: "Don't have an account?",
    createAccount: 'Create Account',
    secureTitle: 'Secure & Trusted',
    secureSubtitle: 'Your data is safe with us',
    clearInput: 'Clear input',
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    errorCredentials: 'Login failed. Please check credentials.',
    errorConnection: 'Unable to reach the server. Check your connection and try again.',
  },
} as const;
