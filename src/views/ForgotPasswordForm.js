import m from "mithril"

const i18n = {
  en: {
    heading: "Reset Your Password",
    subheading: "Enter your email and we'll send you reset instructions.",
    email: "Registered Email",
    button: "Send Reset Link",
    success: "Reset link sent! Please check your email.",
    error: "Could not send reset email. Try again.",
  },
  id: {
    heading: "Atur Ulang Kata Sandi",
    subheading: "Masukkan email Anda dan kami akan mengirimkan instruksi.",
    email: "Email Terdaftar",
    button: "Kirim Tautan Atur Ulang",
    success: "Tautan atur ulang dikirim! Silakan periksa email Anda.",
    error: "Gagal mengirim email atur ulang. Coba lagi.",
  },
}

const ForgotPasswordForm = {
  email: "",
  success: "",
  error: "",
  loading: false,

  view() {
    const lang = localStorage.getItem("lang") || "en"
    const t = i18n[lang]
    document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto")

    return m("main.container", [
      m("article", [
        m("hgroup", [
          m("h1", t.heading),
          m("h2", t.subheading),
        ]),

        ForgotPasswordForm.success && m("p", { style: "color: green" }, t.success),
        ForgotPasswordForm.error && m("p", { style: "color: red" }, t.error),

        m("form", {
          onsubmit: async (e) => {
            e.preventDefault()
            ForgotPasswordForm.success = ForgotPasswordForm.error = ""
            ForgotPasswordForm.loading = true

            try {
              await m.request({
                method: "POST",
                url: "/api/request-password-reset",
                body: { email: ForgotPasswordForm.email },
              })
              ForgotPasswordForm.success = true
            } catch (err) {
              ForgotPasswordForm.error = true
            }

            ForgotPasswordForm.loading = false
          }
        }, [
          m("label", { for: "email" }, t.email),
          m("input", {
            id: "email",
            type: "email",
            value: ForgotPasswordForm.email,
            oninput: e => ForgotPasswordForm.email = e.target.value,
          }),
          m("button", {
            type: "submit",
            disabled: !ForgotPasswordForm.email || ForgotPasswordForm.loading,
            'aria-busy': ForgotPasswordForm.loading ? "true" : null,
          }, t.button),
        ]),
      ]),
    ])
  }
}

export default ForgotPasswordForm