import * as self from "../index"
import { ajaxError } from "./LuaEngine"

export default class ErrorHandler {
    constructor(
    ) { }

    Error(error: Error, resetUrl: boolean = false) {
        alert(error.message)
        self.editor.ToggleLoading(false)
        resetUrl && self.luaEngine.resetUrl()
    }
}

export interface Error {
    message?: string,
    code?: number,
    ajaxError?: ajaxError,
    misc?: {
        sessionId?: string
    }
}