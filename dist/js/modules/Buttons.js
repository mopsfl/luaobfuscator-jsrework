import * as self from "../index";
export default class Buttons {
    OpenDemo() {
        if (!window.states.isObfuscating)
            self.luaEngine.init(() => { }, 1, true);
    }
    UploadFile() {
        self.$(self.elements.lua_file).trigger("click");
    }
}
