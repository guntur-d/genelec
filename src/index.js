import m from "mithril"
import LandingPage from "./views/LandingPage.js"
import SignupForm from "./views/SignupForm.js"
import LoginForm from "./views/LoginForm.js"
import ProfilePage from "./views/ProfilePage.js"
import ChangePasswordForm from "./views/ChangePasswordForm.js"
import ForgotPasswordForm from "./views/ForgotPasswordForm.js"
import ResetPassword from "./views/ResetPassword.js"

m.route.prefix = ""

m.route(document.getElementById("app"), "/", {
    "/": LandingPage,
    "/signup": SignupForm,
    "/login": LoginForm,
    "/profile": ProfilePage,
    "/change-password": ChangePasswordForm,
    "/forgot-password": ForgotPasswordForm,
    "/reset": ResetPassword,
})