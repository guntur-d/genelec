import m from "mithril"

const i18n = {
    en: {
        welcome: "Welcome",
        subtitle: "Select your language and theme below",
        login: "Log In",
        signup: "Sign Up",
        loggedIn: "You are already signed in",
        theme: "Theme",
        language: "Language",
        changePassword: "Change Password",
    },
    id: {
        welcome: "Selamat Datang",
        subtitle: "Pilih bahasa dan tema di bawah ini",
        login: "Masuk",
        signup: "Daftar",
        loggedIn: "Anda sudah masuk",
        theme: "Tema",
        language: "Bahasa",
        changePassword: "Ubah Kata Sandi",
    },
}

const LandingPage = {
    lang: localStorage.getItem("lang") || "en",
    selectedTheme: localStorage.getItem("theme") || "auto",

    themes: ["auto", "light", "dark"],
    oninit: () => {
        // Set initial theme based on localStorage or default to 'auto'
        document.documentElement.setAttribute("data-theme", LandingPage.selectedTheme)

        // Set initial language
        document.documentElement.setAttribute("lang", LandingPage.lang)
    },

    view: () => {
        const t = i18n[LandingPage.lang]
        const isLoggedIn = localStorage.getItem("token") !== null
        document.documentElement.setAttribute("data-theme", LandingPage.selectedTheme)

        return m("main.container", [
            m("hgroup", [
                m("h1", t.welcome),
                m("h2", t.subtitle),
            ]),

            isLoggedIn
                ? m("div", [
                    m("p", { style: "color: green" }, `✅ ${t.loggedIn}`),

                    m("nav", { style: "display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;" }, [
                        m("a", {
                            href: "/change-password",
                            oncreate: m.route.link,
                            style: "text-decoration: underline; color: var(--primary);"  // pretty, Pico-style
                        }, `🔑 ${t.changePassword}`),

                        m("button", {
                            onclick: () => {
                                const lang = localStorage.getItem("lang")
                                const theme = localStorage.getItem("theme")
                                localStorage.clear()
                                localStorage.setItem("lang", lang)
                                localStorage.setItem("theme", theme)
                                location.reload()
                            }
                        }, "🚪 Log Out"),
                    ])
                ])
                : m("nav", { style: "display: flex; gap: 1rem;" }, [
                    m("a", {
                        href: "/login",
                        oncreate: m.route.link,
                    }, `🔐 ${t.login}`),

                    m("a", {
                        href: "/signup",
                        oncreate: m.route.link,
                    }, `📝 ${t.signup}`),
                ]),

            m("section", [
                m("label", `${t.theme}:`),
                m("select", {
                    onchange: (e) => {
                        const value = e.target.value
                        LandingPage.selectedTheme = value
                        localStorage.setItem("theme", value)
                        document.documentElement.setAttribute("data-theme", value)
                    },
                }, LandingPage.themes.map((theme) =>
                    m("option", {
                        value: theme,
                        selected: LandingPage.selectedTheme === theme,
                    }, theme.charAt(0).toUpperCase() + theme.slice(1))
                )),

                m("label", `${t.language}:`),
                m("select", {
                    onchange: (e) => {
                        const value = e.target.value
                        LandingPage.lang = value
                        localStorage.setItem("lang", value)
                    },
                }, ["en", "id"].map((lang) =>
                    m("option", {
                        value: lang,
                        selected: LandingPage.lang === lang,
                    }, lang === "en" ? "🇺🇸 English" : "🇮🇩 Bahasa Indonesia")
                )),
            ]),
        ])
    },
}

export default LandingPage