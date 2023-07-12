import * as self from "../index";
export default class ErrorHandler {
    constructor() { }
    Error(error, resetUrl = false) {
        alert(error.message);
        self.editor.ToggleLoading(false);
        resetUrl && self.luaEngine.resetUrl();
    }
}
