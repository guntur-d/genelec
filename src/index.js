import m from "mithril"
import LandingPage from "./views/LandingPage.js"
import SignupForm from "./views/SignupForm.js"
import LoginForm from "./views/LoginForm.js"
import ProfilePage from "./views/ProfilePage.js"

// ✨ Add this line:
m.route.prefix = ""

 



m.route(document.getElementById("app"), "/", {
  "/": LandingPage,
  "/signup": SignupForm,
  "/login": LoginForm,
  "/profile": ProfilePage
})