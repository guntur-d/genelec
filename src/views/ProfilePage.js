import m from "mithril"
import { getFingerprint } from "../../lib/fingerprint.js"

const ProfilePage = {
  user: null,
  error: "",
  loading: true,

  oninit: async () => {
    const visitorId = await getFingerprint()

    try {
      const res = await m.request({
        method: "GET",
        url: "/api/profile",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Device-Fingerprint": visitorId // 👈 send it here!
        }
      })

      ProfilePage.user = res.user
    } catch (err) {
      ProfilePage.error = err.message || "Unauthorized"
    }

    ProfilePage.loading = false
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