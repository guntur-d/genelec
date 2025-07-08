import m from "mithril"

const ProfilePage = {
    user: null,
    error: "",

    oninit: async () => {
        try {
            const res = await m.request({
                method: "GET",
                url: "/api/profile",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            ProfilePage.user = res.user
        } catch (err) {
            console.error("❌ Unauthorized or server error:", err)
            ProfilePage.error = err

        }
    },

    view: () => {
        return m("main.container", [
            m("h1", "👤 Profile"),
            ProfilePage.error
                ? m("p", { style: "color:red" }, `❌ ${String(ProfilePage.error.message || ProfilePage.error)}`)
                : ProfilePage.user
                    ? m("pre", JSON.stringify(ProfilePage.user, null, 2))
                    : m("p", "⏳ Loading...")
        ])
    }
}

export default ProfilePage