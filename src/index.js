import m from "mithril"
import LandingPage from "./views/LandingPage.js"
import SignupForm from "./views/SignupForm.js"
import LoginForm from "./views/LoginForm.js"
import ProfilePage from "./views/ProfilePage.js"
import ChangePasswordForm from "./views/ChangePasswordForm.js"  // ✅ New import
import ForgotPasswordForm from "./views/ForgotPasswordForm.js"  // ✅ New import

m.route.prefix = ""

m.route(document.getElementById("app"), "/", {
  "/": LandingPage,
  "/signup": SignupForm,
  "/login": LoginForm,
  "/profile": ProfilePage,
  "/change-password": ChangePasswordForm,  // ✅ Route now available
  "/forgot-password": ForgotPasswordForm  // ✅ New route

})

