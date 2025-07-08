import m from "mithril"

function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

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
    const strength = SignupForm.getPasswordStrength(SignupForm.password)
    const strengthLabels = ["Too Weak", "Weak", "Fair", "Strong", "Very Strong"]

    SignupForm.validateForm()

    return m("main.container", [
      m("article", [
        m("hgroup", [
          m("h1", "Create Account"),
          m("h2", "Join us and start your journey"),
        ]),

        SignupForm.error && m("p", { class: "text-red-600" }, SignupForm.error),
        SignupForm.success && m("p", { class: "text-green-600" }, SignupForm.success),

        m("form", {
          onsubmit: async (e) => {
            e.preventDefault()
            SignupForm.error = SignupForm.success = ""

            if (SignupForm.password !== SignupForm.confirmPassword) {
              SignupForm.error = "Passwords do not match"
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
              SignupForm.error = err.message || "Signup failed"
              if (err.status === 409) {
                SignupForm.error = "Username or email already exists"
              }
            }
          },
        }, [
          m("label", { for: "fullName" }, "Full Name"),
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

          m("label", { for: "userName" }, "Username"),
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
            m("small", "⏳ Checking availability..."),
          SignupForm.userName && SignupForm.userNameAvailable === true &&
            m("small", { style: "color:green" }, "✅ Username is available"),
          SignupForm.userName && SignupForm.userNameAvailable === false &&
            m("small", { style: "color:red" }, "❌ Username is taken"),

          m("label", { for: "email" }, "Email"),
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

          m("label", { for: "password" }, "Password"),
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
            m("small", strengthLabels[strength - 1] || "Too Weak"),
          SignupForm.password &&
            m("progress", {
              value: strength,
              max: 5,
              style: "width:100%; height: 8px;",
            }),

          m("label", { for: "confirmPassword" }, "Confirm Password"),
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

          m("input", {
            type: "submit",
            value: "Sign Up",
            disabled: !SignupForm.isFormValid || SignupForm.userNameAvailable === null,
          }),

          !SignupForm.isFormValid &&
            m("p", { style: "color:#e1a500" }, "Please complete all fields correctly."),
        ]),
      ]),
    ])
  }
}


export default SignupForm

 