import m from "mithril"

const i18n = {
  en: {
    heading: "Log In",
    subheading: "Welcome back! Please sign in.",
    email: "Email",
    password: "Password",
    login: "Log In",
    error: "Login failed. Please check your credentials.",
  },
  id: {
    heading: "Masuk",
    subheading: "Selamat datang! Silakan masuk.",
    email: "Surel",
    password: "Kata Sandi",
    login: "Masuk",
    error: "Login gagal. Silakan periksa kembali kredensial Anda.",
  },
}

const LoginForm = {
  lang: localStorage.getItem("lang") || "en",
  email: "",
  password: "",
  error: "",
  success: "",
  loading: false, // ⏳ Track whether request is in progress

  view: () => {
    const t = i18n[LoginForm.lang]

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

          m("input", {
            type: "submit",
            value: LoginForm.loading ? "⏳ Please wait..." : t.login,
            disabled: !(LoginForm.email && LoginForm.password),
          }),
        ]),
      ]),
    ])
  },
}

export default LoginForm