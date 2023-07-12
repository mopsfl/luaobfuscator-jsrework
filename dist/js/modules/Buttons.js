import * as self from "../index";
export default class Buttons {
    OpenDemo() { if (!window.states.isObfuscating)
        self.luaEngine.init(() => { }, 1, true); }
    UploadFile() { self.$(self.elements.lua_file).trigger("click"); }
    ToggleDropdown(btns_div, toolboxbtn) {
        toolboxbtn?.classList.toggle("toolbox-hit");
        btns_div.style.display = btns_div.style.display == "none" ? "block" : "none";
    }
}
