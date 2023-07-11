import * as self from "../index"

export default class Editor {
    constructor(
        readonly test = "test"
    ) { }


    StartObfuscation() {
        if (window.states?.isObfuscating) return
        self.elements.codewindow.style.filter = "blur(3px)"
        window.states.isObfuscating = true

        return true
    }

    StopObfuscation() {
        if (!window.states?.isObfuscating) return
        self.elements.codewindow.style.filter = "blur(3px)"
        window.states.isObfuscating = false

        return true
    }

    Callback(lastEvent?: any) {
        this.StopObfuscation()
        if (!window.luaEngine.parseScript(self.elements.codewindow, lastEvent)) return

        this.ToggleWindowState(window.luaEngine.getSessionId() != null)
    }

    ToggleWindowState(State: boolean = window.states.windowState) {
        const _state = State ? !State : !window.states.windowState
        window.states.windowState = _state
        if (_state == true) {
            self.elements.ide.style.display = "none"
            self.elements.home_landingpage.style.display = "flex"
            self.elements.home_landing.style.display = "flex"
            self.elements.toolbox.style.display = "none"
            self.elements.codewindow.style.filter = "blur(0)"
        } else {
            self.elements.toolbox.style.display = "block"
            self.elements.toolbox.style.filter = "none"
            self.elements.ide.style.display = "flex"
            self.elements.home_landingpage.style.display = "none"
            self.elements.home_landing.style.display = "none"
            self.elements.codewindow.style.filter = "blur(0)"
        }
    }
}