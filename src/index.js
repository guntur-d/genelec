import m from "mithril"
import SignupForm from "./views/SignupForm.js"

console.log("✔️ Mounting SignupForm")    // ← add this to see if script runs
m.mount(document.getElementById("app"), SignupForm)