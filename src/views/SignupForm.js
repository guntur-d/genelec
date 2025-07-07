import m from "mithril"

const SignupForm = {
  email: "",
  password: "",
  error: "",
  success: "",

  view: () =>
    m(
      ".flex.items-center.justify-center.min-h-screen.bg-base-200.px-4",
      m(
        ".card.w-full.max-w-sm.shadow-xl.bg-base-100",
        m(
          "form.card-body.space-y-6",
          {
            onsubmit: async (e) => {
              e.preventDefault()
              SignupForm.error = SignupForm.success = ""
              try {
                const res = await m.request({
                  method: "POST",
                  url: "/api/signup",
                  body: {
                    email: SignupForm.email,
                    password: SignupForm.password,
                  },
                })
                SignupForm.success = res.msg
                localStorage.setItem("token", res.token)
              } catch (err) {
                SignupForm.error =
                  err.response?.data?.error || "Signup failed"
              }
            },
          },
          [
            // 🌟 Header
            m("h2.text-2xl.font-semibold.text-center.text-primary", "Create an Account"),

            // ❌ Error
            SignupForm.error &&
              m(".alert.alert-error", m("span", SignupForm.error)),

            // ✅ Success
            SignupForm.success &&
              m(".alert.alert-success", m("span", SignupForm.success)),

            // 📧 Email
            m(".form-control", [
              m("label.label", m("span.label-text", "Email")),
              m("input.input.input-bordered.w-full", {
                type: "email",
                placeholder: "you@example.com",
                value: SignupForm.email,
                oninput: (e) => (SignupForm.email = e.target.value),
              }),
            ]),

            // 🔒 Password
            m(".form-control", [
              m("label.label", m("span.label-text", "Password")),
              m("input.input.input-bordered.w-full", {
                type: "password",
                placeholder: "••••••••",
                value: SignupForm.password,
                oninput: (e) => (SignupForm.password = e.target.value),
              }),
            ]),

            // 🚀 Submit
            m("button.btn.btn-primary.w-full.mt-4", { type: "submit" }, "Sign Up"),
          ]
        )
      )
    ),
}

export default SignupForm