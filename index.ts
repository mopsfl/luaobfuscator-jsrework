import Elements from "./modules/Elements"
import Buttons from "./modules/Buttons"
import Editor from "./modules/Editor"
import LuaEngine from "./modules/LuaEngine"
import * as _ from "lodash"
import $ from "jquery"

const elements = new Elements()
const buttons = new Buttons()
const editor = new Editor()
const luaEngine = new LuaEngine()

window.onload = async () => {
    window.states = {
        isObfuscating: false,
        windowState: false,
    }

    $(elements.btn_demo).on("click", () => buttons.OpenDemo())
    window.luaEngine.init((lastEvent: number) => { editor.Callback(lastEvent) }, 1)
}


declare global {
    interface Window {
        luaEngine: {
            cleanup: Function,
            getInstances: Function,
            getLines: Function,
            getSessionId: Function,
            init: Function,
            initFromUrl: Function,
            obfuscate: Function,
            obfuscateToken: Function,
            parseScript: Function,
            updateLastTick: Function,
            updateScript: Function,
        },
        states: {
            isObfuscating: boolean,
            windowState: boolean,
        },
        modules: {}
    }
}

window.modules = {
    classes: { Elements, Buttons, Editor, LuaEngine },
    initalized: { elements, buttons, editor, luaEngine }
}

export {
    elements,
    buttons,
    editor
}