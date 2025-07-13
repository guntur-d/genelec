import m from "mithril"

const ResetPassword = {
  email: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
  error: "",
  success: "",
  loading: false,

  oninit: () => {
    ResetPassword.email = m.route.param("email") || ""
    ResetPassword.code = m.route.param("code") || ""
  },

  view: () => {
    const lang = localStorage.getItem("lang") || "en"
    const t = {
      en: {
        heading: "Reset Password",
        subheading: "Enter your new password below.",
        newPassword: "New Password",
        confirmPassword: "Confirm Password",
        submit: "Update Password",
        success: "✅ Password updated successfully!",
        error: "❌ Error updating password. Try again.",
        mismatch: "❌ Passwords do not match.",
        short: "❌ Password too short (min 6 characters).",
      },
      id: {
        heading: "Atur Ulang Kata Sandi",
        subheading: "Masukkan kata sandi baru Anda.",
        newPassword: "Kata Sandi Baru",
        confirmPassword: "Konfirmasi Kata Sandi",
        submit: "Perbarui Kata Sandi",
        success: "✅ Kata sandi berhasil diperbarui!",
        error: "❌ Gagal memperbarui kata sandi. Coba lagi.",
        mismatch: "❌ Kata sandi tidak cocok.",
        short: "❌ Kata sandi terlalu pendek (min 6 karakter).",
      }
    }[lang]

    return m("main.container", [
      m("article", [
        m("hgroup", [
          m("h1", t.heading),
          m("h2", t.subheading)
        ]),
        ResetPassword.success && m("p", { style: "color: green" }, t.success),
        ResetPassword.error && m("p", { style: "color: red" }, ResetPassword.error),
        m("form", {
          onsubmit: async (e) => {
            e.preventDefault()
            ResetPassword.error = ResetPassword.success = ""
            if (ResetPassword.newPassword !== ResetPassword.confirmPassword) {
              ResetPassword.error = t.mismatch
              return
            }
            if (ResetPassword.newPassword.length < 6) {
              ResetPassword.error = t.short
              return
            }
            ResetPassword.loading = true
            try {
              const res = await m.request({
                method: "POST",
                url: "/api/change-password",
                body: {
                  email: ResetPassword.email,
                  resetCode: ResetPassword.code,
                  newPassword: ResetPassword.newPassword,
                }
              })
              // ResetPassword.success = res.msg || "Password updated"
              // ResetPassword.newPassword = ResetPassword.confirmPassword = ""
              m.route.set("/login", { success: "password_reset" })
            } catch (err) {
              ResetPassword.error = err.message || t.error
            }
            ResetPassword.loading = false
          }
        }, [
          m("label", { for: "newPassword" }, t.newPassword),
          m("input", {
            id: "newPassword",
            type: "password",
            value: ResetPassword.newPassword,
            oninput: (e) => ResetPassword.newPassword = e.target.value,
          }),
          m("label", { for: "confirmPassword" }, t.confirmPassword),
          m("input", {
            id: "confirmPassword",
            type: "password",
            value: ResetPassword.confirmPassword,
            oninput: (e) => ResetPassword.confirmPassword = e.target.value,
          }),
          m("button", {
            type: "submit",
            disabled: ResetPassword.loading,
            'aria-busy': ResetPassword.loading ? "true" : false,
          }, t.submit)
        ])
      ])
    ])
  }
}

export default ResetPassword