import m from "mithril"
import { getFingerprint } from "../../lib/fingerprint.js"

const lang = localStorage.getItem("lang") || "en"

const ChangePasswordForm = {
  language: lang,
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  newPasswordInput: "",
  fingerprint: "",
  message: "",
  error: "",
  isSubmitting: false,

  t(key) {
    return ChangePasswordForm.translations[ChangePasswordForm.language][key] || key
  },

  translations: {
    en: {
      title: "Change Password",
      old: "Current Password",
      new: "New Password",
      confirm: "Confirm New Password",
      mismatch: "New passwords do not match",
      changed: "Password changed successfully",
      invalid: "Invalid old password or fingerprint",
      button: "Update Password",
      strength: ["Too Weak", "Weak", "Fair", "Strong", "Very Strong"],
    },
    id: {
      title: "Ubah Kata Sandi",
      old: "Kata Sandi Saat Ini",
      new: "Kata Sandi Baru",
      confirm: "Konfirmasi Kata Sandi Baru",
      mismatch: "Kata sandi baru tidak cocok",
      changed: "Kata sandi berhasil diubah",
      invalid: "Kata sandi atau sidik perangkat tidak valid",
      button: "Perbarui Kata Sandi",
      strength: ["Terlalu Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"],
    },
  },

  getPasswordStrength(pwd) {
    if (!pwd) return 0
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  },

  async submit(e) {
    e.preventDefault()
    ChangePasswordForm.error = ChangePasswordForm.message = ""
    ChangePasswordForm.isSubmitting = true

    if (ChangePasswordForm.newPasswordInput !== ChangePasswordForm.confirmPassword) {
      ChangePasswordForm.error = "mismatch"
      ChangePasswordForm.isSubmitting = false
      return
    }

    try {
      const fingerprint = await getFingerprint()
      const token = localStorage.getItem("token")

      await m.request({
        method: "POST",
        url: "/api/change-password",
        body: {
          oldPassword: ChangePasswordForm.oldPassword,
          newPassword: ChangePasswordForm.newPasswordInput,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "x-device-fingerprint": fingerprint,
        },
      })

      ChangePasswordForm.message = "changed"
      ChangePasswordForm.oldPassword = ""
      ChangePasswordForm.newPasswordInput = ""
      ChangePasswordForm.confirmPassword = ""

      // ⏳ Give a tiny delay for UX (optional)
      setTimeout(() => {
        m.route.set("/")
      }, 1000)
    } catch (err) {
      ChangePasswordForm.error = "invalid"
    } finally {
      ChangePasswordForm.isSubmitting = false
    }
  },

  view() {
    document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto")
    // Validate the language from localStorage before using it
    let lang = localStorage.getItem("lang")
    if (!ChangePasswordForm.translations.hasOwnProperty(lang)) {
      lang = "en"
    }
    ChangePasswordForm.language = lang // Update component state

    const strength = ChangePasswordForm.getPasswordStrength(ChangePasswordForm.newPasswordInput)
    const t = ChangePasswordForm.t // Translation helper already uses this.language

    return m("main.container", [
      m("form", { onsubmit: ChangePasswordForm.submit, style: "max-width: 400px; margin: auto" }, [
        m("h2", t("title")),

        m("label", { for: "old" }, t("old")),
        m("input", {
          id: "old",
          type: "password",
          value: ChangePasswordForm.oldPassword,
          oninput: e => ChangePasswordForm.oldPassword = e.target.value,
        }),

        m("label", { for: "new" }, t("new")),
        m("input", {
          id: "new",
          type: "password",
          value: ChangePasswordForm.newPasswordInput,
          oninput: e => ChangePasswordForm.newPasswordInput = e.target.value,
        }),
        ChangePasswordForm.newPasswordInput &&
        m("small", t("strength")[strength - 1] || t("strength")[0]),
        ChangePasswordForm.newPasswordInput &&
        m("progress", {
          value: strength,
          max: 5,
          style: "width: 100%; height: 6px;"
        }),

        m("label", { for: "confirm" }, t("confirm")),
        m("input", {
          id: "confirm",
          type: "password",
          value: ChangePasswordForm.confirmPassword,
          oninput: e => ChangePasswordForm.confirmPassword = e.target.value,
        }),

        m("button", {
          type: "submit",

          disabled:
            ChangePasswordForm.isSubmitting ||
            !ChangePasswordForm.oldPassword ||
            !ChangePasswordForm.newPasswordInput ||
            !ChangePasswordForm.confirmPassword ||
            ChangePasswordForm.newPasswordInput !== ChangePasswordForm.confirmPassword,
          'aria-busy': ChangePasswordForm.isSubmitting ? "true" : false
        },

          ChangePasswordForm.t("button")
        ),
        ChangePasswordForm.error &&
        m("p", { style: "color:red; margin-top: 8px" }, t(ChangePasswordForm.error)),

        ChangePasswordForm.message &&
        m("p", { style: "color:green; margin-top: 8px" }, t(ChangePasswordForm.message)),
      ]),
    ])
  }
}

export default ChangePasswordForm