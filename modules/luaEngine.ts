import Misc from "./Misc"
import * as self from "../index"
import * as _ from "lodash"

const misc = new Misc()

export default class LuaEngine {
    constructor(
        readonly apiUrl = "https://luaobfuscator.com/api/ide/",
        public sessionId: string = null,
        public tokens = [],
        public lineCount: number = 0,
        public lastEvent: number = 0,
        public lastEdit: number = 0,
        public lastApiTry: number = null,
        public lastScript: string = null,
        public isQueued: boolean = false,
        public callback: Function = null,
        public lines: any = null,
        public instances: Array<string> = null,

        public endpoints = {
            session: "?session=",
            initf: "init?f=",
            obfuscateAll: "obfuscateAll/",
            obfuscate: "obfuscate/",
            sessions: "sessions/",
            cleanup: "cleanup/"
        }
    ) { }


    init(callback: Function, flags: number = 0, force: boolean = false, content: string = "") {
        this.lineCount = 0
        this.lastEdit = 0
        this.lastEvent = 0
        this.instances = null
        this.tokens = []
        this.callback = callback


        this.getSessionUrl()
        if (this.sessionId !== null) {
            self.editor.ToggleLoading()
            this.getScript((eventCode?: number) => {
                if (eventCode === null) return this.resetUrl()
                this.callback(eventCode)
            })
        } else if (force) {
            self.editor.ToggleLoading()
            this.initScript(false, flags, content)
        }
    }

    initFromUrl(callback: Function) {
        self.editor.ToggleLoading()
        const url = new URL(window.location.href)
        self.$.getJSON(url.searchParams.get("file"), (data) => {
            this.tokens = data
            callback()
        })
    }

    getSessionId() { return this.sessionId }

    getSessionUrl() {
        this.sessionId = new URLSearchParams(window.location.search).get("session");
        return this.sessionId
    }

    setSessionUrl() {
        const url = new URLSearchParams(window.location.search)
        url.delete("session")
        url.append("session", this.sessionId)
        window.location.search = url.toString()
    }

    resetUrl() {
        const url = new URLSearchParams(window.location.search)
        url.delete("session")
        window.location.search = _.toString(url)
    }

    async getScript(callback: Function) {
        await self.$.ajax({
            url: `${this.apiUrl}${this.endpoints.session}${this.sessionId}`,
            error: (err: any) => {
                const error: ajaxError = err
                self.errorHandler.Error({ ajaxError: error, message: `Error while requesting script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` })
                this.resetUrl()
            },
        }).then(res => {
            const script: Script = res
            this.tokens = script.tokens
            if (!_.isNull(script.message)) {
                if (!_.isNull(script.message)) {
                    self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } })
                    self.editor.ToggleLoading(false)
                }
                if (_.isFunction(callback)) callback(-1)
                return;
            }
            if (!callback) return
            if (script.tokens) {
                window.states.windowState = true
                callback(-1)
            } else callback(null)
        })
        self.editor.ToggleLoading()
    }

    async initScript(reset: boolean, flag: number = 0, content: string = "") {
        await self.$.ajax({
            url: `${this.apiUrl}${this.endpoints.initf}${flag}`,
            method: "POST",
            data: content,
            error: (err: any) => {
                const error: ajaxError = err
                self.errorHandler.Error({ ajaxError: error, message: `Error while initializing script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` })
            },
        }).then(res => {
            const script: Script = res
            this.sessionId = script.sessionId
            if (!reset) this.setSessionUrl()
        })
        self.editor.ToggleLoading()
    }

    resetScript(flag: number = 0) {
        this.initScript(true, flag)
    }

    updateLastTick() {
        this.lastApiTry = misc.getTick()
    }

    async updateScript(script: string, callback: Function) {
        let tick = misc.getTick()
        if (this.lastApiTry + 2000 > tick) {
            this.lastApiTry = tick
            this.lastScript = script
            if (!this.isQueued) {
                this.isQueued = true
                console.log(`queue: ${this.isQueued}`)

                function wait() {
                    tick = new Date().getTime()
                    if (this.lastApiTry + 2000 > tick) {
                        console.log("new wait...")
                        setTimeout(wait, 500)
                        return;
                    }
                    this.updateScript(this.lastScript, callback)
                    console.log("isQueued = false")
                    this.isQueued = false
                    this.lastScript = null;
                }
                wait();
            }
            console.log("waiting...")
            return;
        }
        this.lastEvent = tick
        this.lastApiTry = tick
        console.log(`new event: ${tick}`)
        await self.$.ajax({
            url: this.apiUrl,
            method: "POST",
            data: script,
            headers: {
                "sessionId": this.sessionId
            },
            error: (err: any) => {
                const error: ajaxError = err
                self.errorHandler.Error({ ajaxError: error, message: `Error while updating script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` })
            },
        }).then(res => {
            const script: Script = res
            this.tokens = script.tokens
            if (!_.isNull(script.message)) {
                self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } })
            }
            if (_.isFunction(callback)) callback(tick)
        })
        self.editor.ToggleLoading(false)
    }

    async Obfuscate(option: string, percent: string | number, callback: Function) {
        self.editor.StartObfuscation()
        await self.$.ajax({
            url: `${this.apiUrl}${this.endpoints.obfuscateAll}${option}/${percent}`,
            method: "POST",
            headers: {
                "sessionId": this.sessionId
            },
            error: (err: any) => {
                const error: ajaxError = err
                self.errorHandler.Error({ ajaxError: error, message: `Error while obfuscating script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` })
                self.editor.StopObfuscation()
            },
        }).then(res => {
            const script: Script = res
            this.tokens = script.tokens
            if (!_.isNull(script.message)) {
                self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } })
                self.editor.ToggleLoading(false)
            }
            if (_.isFunction(callback)) callback(-1)
        }).done(() => {
            console.log("obfuscation done")
        })
        self.editor.StopObfuscation()
        self.editor.ToggleLoading(false)
    }

    obfuscateToken(tokenId: number | string, callback: Function) {
        self.$.ajax({
            url: `${this.apiUrl}/${this.endpoints.obfuscate}/${tokenId}`,
            method: "POST",
            headers: {
                "sessionId": this.sessionId
            },
            error: (err: any) => {
                const error: ajaxError = err
                self.errorHandler.Error({ ajaxError: error, message: `Error while obfuscating script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` })
            },
        }).then(res => {
            const script: Script = res
            this.tokens = script.tokens
            if (!_.isNull(script.message)) self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } })
            if (_.isFunction(callback)) callback(-1)
        })
    }

    async getInstances(): Promise<any> {
        await self.$.ajax({
            url: `${this.apiUrl}${this.endpoints.sessions}`,
            method: "GET",
            error: (err: any) => {
                const error: ajaxError = err
                self.errorHandler.Error({ ajaxError: error, message: `Unable to get instances.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` })
            },
        }).then(res => {
            this.instances = res
        })

        return this.instances
    }

    cleanUp(callback: Function) {
        self.$.ajax({
            url: `${this.apiUrl}/${this.endpoints.cleanup}`,
            method: "POST",
            headers: {
                "sessionId": this.sessionId
            },
            error: (err: any) => {
                const error: ajaxError = err
                self.errorHandler.Error({ ajaxError: error, message: `Error while cleaning up script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` })
            },
        }).then(res => {
            const script: Script = res
            this.tokens = script.tokens
            if (!_.isNull(script.message)) {
                self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } })
                self.editor.ToggleLoading(false)
            }
            if (_.isFunction(callback)) callback(-1)
        })
    }

    onVariableChange(event: MouseEvent) {
        const target: any = event.target,
            classes = target.className.split(' '),
            newName = target.innerHTML,
            spans = document.getElementsByClassName(classes[0]);

        for (var i = 0; i < spans.length; i++) {
            if (spans[i] == target) continue;
            spans[i].innerHTML = newName
        }
    }

    parseScript(targetElement: HTMLElement | Element, tick: number): boolean | undefined {
        console.log(`finish event: ${tick}`)
        if (!this.tokens || this.tokens.length == 0 || (tick != -1 && (tick != this.lastEvent || tick != this.lastApiTry))) return
        targetElement.innerHTML = ""

        if (this.tokens.length > 100000000) {
            let str = ""
            this.tokens.forEach((token: Token, i) => {
                str.concat(token.value)
            })
            targetElement.innerHTML = str
        } else {
            this.tokens.forEach((token: Token, i) => {
                if (i > 100000000) {
                    targetElement.innerHTML += token.value
                } else {
                    var addNoteClass = "";
                    switch (token.type) {
                        case 0: case 1: addNoteClass = ""; break;
                        case 2: addNoteClass = "c_green"; break;
                        case 3: addNoteClass = "c_white"; break;
                        case 4: addNoteClass = "c_blue"; break;
                        case 5: addNoteClass = "c_purple"; break;
                        case 6: addNoteClass = "c_pink"; break;
                        case 7: addNoteClass = "c_yellow"; break;
                        case 8: addNoteClass = ""; break;
                    }
                    const newSpan: HTMLElement = document.createElement("span")
                    if (token.xref != 0) {
                        addNoteClass = "c_ref-" + token.xref + " " + addNoteClass;
                        newSpan.contentEditable = "true";
                        newSpan.addEventListener("input", this.onVariableChange);
                        var hexstr = "";
                        let date = new Date();
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        if (month === 2 && day === 14) {
                            var hexstr = misc.getRandomHex((token.xref * 13) % 360, 360, 300, 360, 30, 100, 30, 100);
                        } else if (month == 6) {
                            var hexstr = misc.getRandomHex((token.xref * 13) % 360, 360, 0, 360, 100, 100, 60, 70);
                        } else if (month == 10 && day == 31) {
                            var hexstr = misc.getRandomHex((token.xref * 13) % 360, 360, 20, 40, 100, 100, 60, 80);
                        }
                        if (hexstr != "") {
                            newSpan.style.color = `#${hexstr} !important`
                            newSpan.style.textShadow = `0 0 4px #${hexstr}AF;"`
                        }
                    }
                    if (addNoteClass != "") {
                        newSpan.className = addNoteClass;
                    }
                    newSpan.className = addNoteClass;
                    newSpan.classList.add("ctoken")
                    newSpan.appendChild(document.createTextNode(token.value))
                    newSpan.id = "token-" + i;
                    targetElement.append(newSpan);
                }
            })
        }
        return true
    }

    getLines() { this.lines = self.$(".ctoken"); return this.lines }
}

export interface Script {
    sessionId: string,
    message: string,
    tokens: Array<{
        id: number,
        type: number,
        value: string,
        xref: number
    }>
}

export interface Token {
    id: number,
    type: number,
    value: string,
    xref: number
}

export interface ajaxError {
    responseJSON: JSON,
    responseText: string,
    statusText: string,
    status: number,
    state: Function,
    then: Function
}