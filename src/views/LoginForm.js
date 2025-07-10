import m from "mithril"

console.log('login fire')

import { getFingerprint } from "../../lib/fingerprint.js"

const i18n = {
  en: {
    heading: "Log In",
    subheading: "Welcome back! Please sign in.",
    email: "Email",
    password: "Password",
    login: "Log In",
    error: "Login failed. Please check your credentials.",
    forgotPassword: "Forgot your password?",
    reset: {
      heading: "Reset Your Password",
      subheading: "Enter your email and we'll send you reset instructions.",
      email: "Registered Email",
      button: "Send Reset Link",
      success: "Reset link sent! Please check your email.",
      error: "Could not send reset email. Try again.",
    },
  },
  id: {
    heading: "Masuk",
    subheading: "Selamat datang! Silakan masuk.",
    email: "Surel",
    password: "Kata Sandi",
    login: "Masuk",
    error: "Login gagal. Silakan periksa kembali kredensial Anda.",
    forgotPassword: "Lupa kata sandi?",
    reset: {
      heading: "Atur Ulang Kata Sandi",
      subheading: "Masukkan email Anda dan kami akan mengirimkan instruksi.",
      email: "Email Terdaftar",
      button: "Kirim Tautan Atur Ulang",
      success: "Tautan atur ulang dikirim! Silakan periksa email Anda.",
      error: "Gagal mengirim email atur ulang. Coba lagi.",
    },
  },
}

const LoginForm = {


  email: "",
  password: "",
  error: "",
  success: "",
  loading: false, // ⏳ Track whether request is in progress
  forgotEmail: "",
  resetSuccess: false,
  resetError: "",
  showResetModal: false,
  resetLoading: false,
  resetStep: 1, // 1: email, 2: code
  resetCode: "",
  serverCode: "", // store code from backend (for demo, in real app, validate on backend)


  view: () => {

    document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto")
    const lang = localStorage.getItem("lang") || "en"
    const t = i18n[lang]


    return m("main.container", [
      m("article", [
        m("hgroup", [
          m("h1", t.heading),
          m("h2", t.subheading),
        ]),

        LoginForm.error && m("p", { style: "color: red;" }, `❌ ${t.error}`),
        LoginForm.success && m("p", { style: "color: green;" }, "✅ Login successful"),

        m("form", {
          onsubmit: async (e) => {
            e.preventDefault()
            LoginForm.error = LoginForm.success = ""
            LoginForm.loading = true

            try {
              const res = await m.request({
                method: "POST",
                url: "/api/login",
                body: {
                  email: LoginForm.email,
                  password: LoginForm.password,
                  fingerprint: await getFingerprint()
                },
              })

              LoginForm.success = res.msg || "Logged in"
              localStorage.setItem("token", res.token)
              m.route.set("/")
            } catch (err) {
              LoginForm.error = err.message || "Login failed"
              if (err.status === 401) LoginForm.error = t.error
            }

            LoginForm.loading = false
          },
        }, [
          m("label", { for: "email" }, t.email),
          m("input", {
            id: "email",
            type: "email",
            placeholder: "you@example.com",
            value: LoginForm.email,
            oninput: (e) => (LoginForm.email = e.target.value),
          }),

          m("label", { for: "password" }, t.password),
          m("input", {
            id: "password",
            type: "password",
            placeholder: "••••••••",
            value: LoginForm.password,
            oninput: (e) => (LoginForm.password = e.target.value),
          }),

          m("button", {
            type: "submit",
            //  value:  t.login,
            //  value: LoginForm.loading ? "⏳ " + t.login : t.login,
            'aria-busy': LoginForm.loading ? "true" : false,
            disabled: !(LoginForm.email && LoginForm.password),
          }, t.login),
        ]), m("a", {
          style: "margin-top: 0.5rem; text-decoration: underline; cursor: pointer; display: inline-block;",
          onclick: () => {
            LoginForm.resetSuccess = LoginForm.resetError = ""
            LoginForm.forgotEmail = LoginForm.email // preload if already typed
            LoginForm.showResetModal = true
          }
        }, lang === "id" ? "🔑 Lupa kata sandi?" : "🔑 Forgot your password?"),
      ]),
    ],
 LoginForm.showResetModal &&
    m("dialog[open]", {
      style: "max-width: 400px; margin: auto; border-radius: 6px;"
    }, [
      m("article", [
        m("header", [
          m("h3", lang === "id" ? "Lupa Kata Sandi" : "Forgot Password"),
        ]),
        m("p", lang === "id"
          ? "Masukkan email yang terdaftar untuk menerima kode reset."
          : "Enter your registered email to receive a reset code."
        ),
        // Step 1: Email input
        LoginForm.resetStep === 1 && [
          LoginForm.resetSuccess && m("p", { style: "color: green" },
            lang === "id" ? "✅ Kode berhasil dikirim. Silakan cek email Anda." : "✅ Code sent successfully. Please check your email."
          ),
          LoginForm.resetError && m("p", { style: "color: red" },
            lang === "id" ? "❌ Gagal mengirim tautan reset" : "❌ Failed to send reset email"
          ),
          m("form", {
            onsubmit: async (e) => {
              e.preventDefault()
              LoginForm.resetSuccess = LoginForm.resetError = ""
              LoginForm.resetLoading = true
              try {
                const res = await m.request({
                  method: "POST",
                  url: "/api/request-password-reset",
                  body: { email: LoginForm.forgotEmail },
                  headers: { "x-lang": lang }
                })
                LoginForm.resetSuccess = true
                LoginForm.serverCode = res.code // <-- get code from backend (for demo)
                LoginForm.resetStep = 2
              } catch (err) {
                LoginForm.resetError = true
              }
              LoginForm.resetLoading = false
            }
          }, [
            m("label", { for: "forgotEmail" }, lang === "id" ? "Email Terdaftar" : "Registered Email"),
            m("input", {
              id: "forgotEmail",
              type: "email",
              value: LoginForm.forgotEmail,
              oninput: e => LoginForm.forgotEmail = e.target.value
            }),
            m("div", { style: "display: flex; gap: 0.5rem; margin-top: 1rem;" }, [
              m("button.secondary", {
                type: "button",
                onclick: () => {
                  LoginForm.showResetModal = false
                  LoginForm.resetStep = 1
                  LoginForm.resetSuccess = LoginForm.resetError = ""
                  LoginForm.forgotEmail = ""
                  LoginForm.resetCode = ""
                }
              }, lang === "id" ? "Batal" : "Cancel"),
              m("button", {
                type: "submit",
                disabled: !LoginForm.forgotEmail || LoginForm.resetLoading
              }, LoginForm.resetLoading ? (lang === "id" ? "Mengirim..." : "Sending...") : (lang === "id" ? "Kirim Kode" : "Send Code"))
            ])
          ])
        ],
        // Step 2: Code input
        LoginForm.resetStep === 2 && [
          m("form", {
            onsubmit: (e) => {
              e.preventDefault()
              // For demo: compare with serverCode, in real app, validate on backend
              if (LoginForm.resetCode === LoginForm.serverCode) {
                // Redirect to /reset/?code=xxxxxx&email=...
                window.location.href = `/reset/?code=${encodeURIComponent(LoginForm.resetCode)}&email=${encodeURIComponent(LoginForm.forgotEmail)}`
              } else {
                LoginForm.resetError = true
              }
            }
          }, [
            m("label", { for: "resetCode" }, lang === "id" ? "Kode 6 Digit" : "6 Digit Code"),
            m("input", {
              id: "resetCode",
              type: "text",
              maxlength: 6,
              pattern: "\\d{6}",
              value: LoginForm.resetCode,
              oninput: e => {
                LoginForm.resetCode = e.target.value.replace(/\D/g, "").slice(0, 6)
                LoginForm.resetError = false
              }
            }),
            LoginForm.resetError && m("p", { style: "color: red" },
              lang === "id" ? "❌ Kode salah" : "❌ Incorrect code"
            ),
            m("div", { style: "display: flex; gap: 0.5rem; margin-top: 1rem;" }, [
              m("button.secondary", {
                type: "button",
                onclick: () => {
                  LoginForm.resetStep = 1
                  LoginForm.resetCode = ""
                  LoginForm.resetError = false
                }
              }, lang === "id" ? "Kembali" : "Back"),
              m("button", {
                type: "submit",
                disabled: LoginForm.resetCode.length !== 6
              }, lang === "id" ? "Konfirmasi" : "Confirm")
            ])
          ])
        ]
      ])
    ]))
  },
}



export default LoginForm