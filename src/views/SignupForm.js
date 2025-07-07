import m from "mithril"




const SignupForm = {



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
  fullName: "",


  userName: "",
  userNameAvailable: null, // true, false, or null  


  email: "",
  password: "",
  confirmPassword: "",
  error: "",
  success: "",

  isFormValid: false,

  view: () => {
    const strength = SignupForm.getPasswordStrength(SignupForm.password)
    const strengthLabels = ["Too Weak", "Weak", "Fair", "Strong", "Very Strong"]
    const strengthColors = ["error", "warning", "info", "success", "primary"]
    SignupForm.validateForm() // Initial validation

    return m(
      "section.min-h-screen.bg-base-200.flex.items-center.justify-center.p-4",
      m(
        "form.card.w-full.max-w-sm.bg-base-100.shadow-xl",
        {
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
              // ...existing code...
              SignupForm.error = err.message || "Signup failed"
              // ...existing code...
              console.error("Signup error:", err)
              if (err.status === 409) {
                SignupForm.error = "Username or email already exists"
              }
            }
          },
        },
        m(".card-body.space-y-4", [
          m("h2.card-title.text-primary.justify-center", "Create Account"),

          SignupForm.error &&
          m(".alert.alert-error.shadow-sm", m("span", SignupForm.error)),
          SignupForm.success &&
          m(".alert.alert-success.shadow-sm", m("span", SignupForm.success)),

          m(".form-control", [
            m("label.label", m("span.label-text", "Full Name")),
            m("input.input.input-bordered", {
              type: "text",
              placeholder: "Guntur D",
              value: SignupForm.fullName,
              oninput: (e) => (SignupForm.fullName = e.target.value, SignupForm.validateForm()),
            }),
          ]),

          m(".form-control", [
            m("label.label", m("span.label-text", "Username")),
            m("input.input.input-bordered", {
              type: "text",
              placeholder: "gdev",
              value: SignupForm.userName,
              oninput: (e) => {
                SignupForm.userName = e.target.value
                SignupForm.userNameAvailable = null
                SignupForm.validateForm()

              },
              onblur: async () => {
                if (!SignupForm.userName) return
                try {
                  const res = await m.request({
                    method: "GET",
                    url: `/api/check-username?userName=${SignupForm.userName}`,
                  })
                  SignupForm.userNameAvailable = res.available
                  SignupForm.validateForm()
                } catch (err) {
                  SignupForm.userNameAvailable = false
                  SignupForm.validateForm()
                }

              },
            }),
            SignupForm.userName &&
            SignupForm.userNameAvailable === true &&
            m("span.text-success.text-sm", "✅ Username is available"),
            SignupForm.userName &&
            SignupForm.userNameAvailable === false &&
            m("span.text-error.text-sm", "❌ Username is taken"), ,
          ]),

          m(".form-control", [
            m("label.label", m("span.label-text", "Email")),
            m("input.input.input-bordered", {
              type: "email",
              placeholder: "you@example.com",
              value: SignupForm.email,
              oninput: (e) => (SignupForm.email = e.target.value, SignupForm.validateForm()),
            }),
          ]),



          m(".form-control", [
            m("label.label", m("span.label-text", "Password")),
            m("input.input.input-bordered", {
              type: "password",
              placeholder: "••••••••",
              value: SignupForm.password,
              oninput: (e) => {
                SignupForm.password = e.target.value

                SignupForm.validateForm()



              },
            }),
            SignupForm.password &&
            m(`.text-${strengthColors[strength - 1] || "error"}.text-sm.mt-1`, strengthLabels[strength - 1] || "Too Weak"),

            SignupForm.password &&
            m("progress.progress", {
              class: `progress-${strengthColors[strength - 1] || "error"} w-full`,
              value: strength,
              max: 5,
            })
          ]),

          m(".form-control", [
            m("label.label", m("span.label-text", "Confirm Password")),
            m("input.input.input-bordered", {
              type: "password",
              placeholder: "••••••••",
              value: SignupForm.confirmPassword,
              oninput: (e) =>
                (SignupForm.confirmPassword = e.target.value, SignupForm.validateForm()),
            }),
          ]),

          m(".card-actions.justify-center.mt-2", [
            m("button.btn.btn-primary.w-full", {
              type: "submit",
              // ...existing code...
              disabled: !SignupForm.isFormValid || SignupForm.userNameAvailable === null,
              // ...existing code...
            }, "Sign Up"), !SignupForm.isFormValid &&
            m("p.text-xs.text-warning", "Please complete all fields correctly.")
            // m("a.btn.btn-ghost.w-full", {
            //   href: "/login",
            //   oncreate: m.route.link,
            // }, "Already have an account? Log in"), 
          ]),
        ])
      ),

    )
  }

}

export default SignupForm