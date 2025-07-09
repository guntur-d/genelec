import m from "mithril"

function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Language dictionary
const i18n = {
  en: {
    createAccount: "Create Account",
    subtitle: "Join us and start your journey",
    fullName: "Full Name",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    usernameAvailable: "✅ Username is available",
    usernameTaken: "❌ Username is taken",
    checking: "⏳ Checking availability...",
    signUp: "Sign Up",
    signingUp: "Signing Up...",
    passwordMismatch: "Passwords do not match",
    usernameOrEmailExists: "Username or email already exists",
    signupFailed: "Signup failed",
    completeFields: "Please complete all fields correctly.",
    tooWeak: "Too Weak",
    weak: "Weak",
    fair: "Fair",
    strong: "Strong",
    veryStrong: "Very Strong",
  },
  id: {
    createAccount: "Buat Akun",
    subtitle: "Bergabunglah dan mulai perjalanan Anda",
    fullName: "Nama Lengkap",
    username: "Nama Pengguna",
    email: "Surel",
    password: "Kata Sandi",
    confirmPassword: "Konfirmasi Kata Sandi",
    usernameAvailable: "✅ Nama pengguna tersedia",
    usernameTaken: "❌ Nama pengguna sudah dipakai",
    checking: "⏳ Memeriksa ketersediaan...",
    signUp: "Daftar",
    signingUp: "Mendaftar...",
    passwordMismatch: "Kata sandi tidak cocok",
    usernameOrEmailExists: "Nama pengguna atau email sudah ada",
    signupFailed: "Pendaftaran gagal",
    completeFields: "Silakan lengkapi semua kolom dengan benar.",
    tooWeak: "Terlalu Lemah",
    weak: "Lemah",
    fair: "Cukup",
    strong: "Kuat",
    veryStrong: "Sangat Kuat",
  }
}

const lang = localStorage.getItem("lang") || "en"
const t = i18n[lang]

const strengthLabels = [
  t.tooWeak,
  t.weak,
  t.fair,
  t.strong,
  t.veryStrong
]

const SignupForm = {
  fullName: "",
  userName: "",
  userNameAvailable: null,
  email: "",
  password: "",
  confirmPassword: "",
  error: "",
  success: "",
  isFormValid: false,
  isLoading: false,

  validateForm() {
    SignupForm.isFormValid =
      SignupForm.fullName.trim() &&
      SignupForm.userName.trim() &&
      SignupForm.email.trim() &&
      SignupForm.password &&
      SignupForm.confirmPassword &&
      SignupForm.password === SignupForm.confirmPassword &&
      SignupForm.userNameAvailable === true
  },

  getPasswordStrength(password) {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  },

  checkUsernameAvailability: debounce(async function () {
    if (!SignupForm.userName) return

    try {
      const res = await m.request({
        method: "GET",
        url: `/api/check-username?userName=${SignupForm.userName}`,
      })
      SignupForm.userNameAvailable = res.available
    } catch (err) {
      SignupForm.userNameAvailable = false
    }

    SignupForm.validateForm()
    m.redraw()
  }, 750),

  view: () => {
    document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto")
    const strength = SignupForm.getPasswordStrength(SignupForm.password)

    SignupForm.validateForm()

    return m("main.container", [
      m("article", [
        m("hgroup", [
          m("h1", t.createAccount),
          m("h2", t.subtitle),
        ]),

        SignupForm.error && m("p", { class: "text-red-600" }, SignupForm.error),
        SignupForm.success && m("p", { class: "text-green-600" }, SignupForm.success),

        m("form", {
          onsubmit: async (e) => {
            e.preventDefault()
            SignupForm.error = SignupForm.success = ""
            SignupForm.isLoading = true
            m.redraw()

            if (SignupForm.password !== SignupForm.confirmPassword) {
              SignupForm.error = t.passwordMismatch
              SignupForm.isLoading = false
              m.redraw()
              return
            }

            try {
              const res = await m.request({
                method: "POST",
                url: "/api/signup",
                body: {
                  fullName: SignupForm.fullName,
                  userName: SignupForm.userName,
                  email: SignupForm.email,
                  password: SignupForm.password,
                },
              })
              SignupForm.success = res.msg
              localStorage.setItem("token", res.token)
            } catch (err) {
              SignupForm.error = err.message || t.signupFailed
              if (err.status === 409) {
                SignupForm.error = t.usernameOrEmailExists
              }
            }
            SignupForm.isLoading = false
            m.redraw()
          },
        }, [
          m("label", { for: "fullName" }, t.fullName),
          m("input", {
            id: "fullName",
            type: "text",
            placeholder: "Guntur D",
            value: SignupForm.fullName,
            oninput: (e) => {
              SignupForm.fullName = e.target.value
              SignupForm.validateForm()
            },
          }),

          m("label", { for: "userName" }, t.username),
          m("input", {
            id: "userName",
            type: "text",
            placeholder: "username123",
            value: SignupForm.userName,
            oninput: (e) => {
              SignupForm.userName = e.target.value
              SignupForm.userNameAvailable = null
              SignupForm.validateForm()
              SignupForm.checkUsernameAvailability()
            },
          }),
          SignupForm.userName && SignupForm.userNameAvailable === null &&
            m("small", t.checking),
          SignupForm.userName && SignupForm.userNameAvailable === true &&
            m("small", { style: "color:green" }, t.usernameAvailable),
          SignupForm.userName && SignupForm.userNameAvailable === false &&
            m("small", { style: "color:red" }, t.usernameTaken),

          m("label", { for: "email" }, t.email),
          m("input", {
            id: "email",
            type: "email",
            placeholder: "you@example.com",
            value: SignupForm.email,
            oninput: (e) => {
              SignupForm.email = e.target.value
              SignupForm.validateForm()
            },
          }),

          m("label", { for: "password" }, t.password),
          m("input", {
            id: "password",
            type: "password",
            placeholder: "••••••••",
            value: SignupForm.password,
            oninput: (e) => {
              SignupForm.password = e.target.value
              SignupForm.validateForm()
            },
          }),
          SignupForm.password &&
            m("small", strengthLabels[strength - 1] || t.tooWeak),
          SignupForm.password &&
            m("progress", {
              value: strength,
              max: 5,
              style: "width:100%; height: 8px;",
            }),

          m("label", { for: "confirmPassword" }, t.confirmPassword),
          m("input", {
            id: "confirmPassword",
            type: "password",
            placeholder: "••••••••",
            value: SignupForm.confirmPassword,
            oninput: (e) => {
              SignupForm.confirmPassword = e.target.value
              SignupForm.validateForm()
            },
          }),

          m("button", {
            type: "submit",
            value: t.signUp,
            disabled: SignupForm.isLoading || !SignupForm.isFormValid || SignupForm.userNameAvailable === null,
            "aria-busy": SignupForm.isLoading ? "true" : null,
          }, SignupForm.isLoading ? m("span", [
            m("span", { "aria-hidden": "true", style: "margin-right: 0.5em;" }, "⏳"),
            t.signingUp
          ]) : t.signUp),

          !SignupForm.isFormValid &&
            m("p", { style: "color:#e1a500" }, t.completeFields),
        ]),
      ]),
    ])
  }
}

export default SignupForm