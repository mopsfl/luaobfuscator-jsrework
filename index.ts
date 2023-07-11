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
    $(elements.btn_uploadfile).on("click", () => buttons.UploadFile())
    $(elements.lua_file).on("change", (e) => {
        const target: any = e.target
        const files: FileList = target.files
        if (window.states.isObfuscating && files.length > 0) return

        window.states.isObfuscating = true
        files[0].text().then(script => luaEngine.init((lastEvent: number) => { editor.Callback(lastEvent) }, 1, true, script))
    })

    luaEngine.init((lastEvent: number) => { editor.Callback(lastEvent) }, 1)
}


declare global {
    interface Window {
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
    editor,
    luaEngine,
    $
}