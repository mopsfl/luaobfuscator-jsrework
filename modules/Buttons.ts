import * as self from "../index"

export default class Buttons {
    OpenDemo() { if (!window.states.isObfuscating) self.luaEngine.init(() => { }, 1, true) }
    UploadFile() { self.$(self.elements.lua_file).trigger("click") }

    ToggleDropdown(btns_div: HTMLElement, toolboxbtn: HTMLElement) {
        toolboxbtn?.classList.toggle("toolbox-hit")
        btns_div.style.display = btns_div.style.display == "none" ? "block" : "none"
    }

    AcceptCookies() {
        self.elements.cookie_popup.style.display = "none"
        self.cookie_js.set({ "cookie_consent": "yes" }, {
            expires: 365
        })
    }

    RejectCookies() {
        self.elements.cookie_popup.style.display = "none"
        self.cookie_js.set({ "cookie_consent": "no" }, {
            expires: 1
        })
    }
}