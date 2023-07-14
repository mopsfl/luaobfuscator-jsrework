const start_tick = new Date().getTime()

import Elements from "./modules/Elements"
import Buttons from "./modules/Buttons"
import Editor from "./modules/Editor"
import LuaEngine from "./modules/LuaEngine"
import ErrorHandler from "./modules/ErrorHandler"
import HeaderTabs from "./modules/HeaderTabs"
import cookie_js from 'cookie_js';
import * as _ from "lodash"
import $ from "jquery"

const elements = new Elements()
const buttons = new Buttons()
const editor = new Editor()
const luaEngine = new LuaEngine()
const errorHandler = new ErrorHandler()
const headerTabs = new HeaderTabs()
$(async (e) => {
    // - VARIABLES - \\

    window.states = {
        isObfuscating: false,
        windowState: false,
        isLoading: false,
    }
    window.info = {
        init_time: NaN,
        packages: [
            { "typescript": "5.1.6" },
            { "lodash": _.VERSION },
            { "jquery": $().jquery },
            { "cookie.js": "1.2.1" },
        ]
    }

    // - INIT - \\

    luaEngine.init((lastEvent: number) => { editor.Callback(lastEvent) }, 1)
    await headerTabs.Update()

    if (_.isNil(cookie_js.get("cookie_consent"))) elements.cookie_popup.style.display = "block"
    $(elements.cookie_accept_btn).on("click", buttons.AcceptCookies)
    $(elements.cookie_reject_btn).on("click", buttons.RejectCookies)

    // - BUTTONS - \\

    $(elements.btn_demo).on("click", () => buttons.OpenDemo())
    $(elements.btn_uploadfile).on("click", () => buttons.UploadFile())
    $(elements.lua_file).on("change", (e) => {
        const target: any = e.target
        const files: FileList = target.files
        if (window.states.isObfuscating && files.length > 0) return

        window.states.isObfuscating = true
        files[0].text().then(script => luaEngine.init((lastEvent: number) => { editor.Callback(lastEvent) }, 1, true, script))
    })

    $(".toolbox-collapsible").on("click", (e) => {
        const btns_div: any = e.target.nextElementSibling
        if (_.isNil(btns_div)) return
        buttons.ToggleDropdown(btns_div, e.target)
    })

    $(".toolbox-button").on("click", async (e) => {
        if (!window.states.isObfuscating) await luaEngine.Obfuscate(e.target.id.replace(new RegExp(/lua.*\W/gm), ""), 1, editor.Callback)
    })

    // - MISC - \\

    window.info.init_time = new Date().getTime() - start_tick
    let c_str = `%cpage took%c${window.info.init_time}ms%cto initalize. \n\n packages:%c\n`
    window.info.packages.forEach(p => c_str += `    - ${Object.keys(p)[0]}: ${Object.values(p)[0]} \n`)
    console.log(`${c_str}`, ...[
        "color: #ffffff; background: #535353; padding: 5px; line-height: 20px",
        "color: white; background: #848484; padding: 5px; line-height: 20px",
        "color: #ffffff; background: #535353; padding: 5px; line-height: 20px",
        "color: #89D718; background: #535353; padding: 5px; line-height: 20px"]);
})


declare global {
    interface Window {
        states: {
            isObfuscating: boolean,
            windowState: boolean,
            isLoading: boolean
        },
        info: {
            init_time: number,
            packages: Array<{}>
        },
        modules: {}
    }
}

window.modules = {
    classes: { Elements, Buttons, Editor, LuaEngine, ErrorHandler, HeaderTabs },
    initalized: { elements, buttons, editor, luaEngine, errorHandler, headerTabs, lodash: _, jquery: $, cookie_js }
}

export {
    elements,
    buttons,
    editor,
    luaEngine,
    errorHandler,
    headerTabs,
    $, _, cookie_js
}