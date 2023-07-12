import * as self from "../index";
export default class ErrorHandler {
    constructor() { }
    Error(error) {
        alert(error.message);
        self.editor.ToggleLoading(false);
        self.luaEngine.resetUrl();
    }
}
