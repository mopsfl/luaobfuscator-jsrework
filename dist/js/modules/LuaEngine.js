import Misc from "./Misc";
import * as self from "../index";
import * as _ from "lodash";
const misc = new Misc();
export default class LuaEngine {
    apiUrl;
    sessionId;
    tokens;
    lineCount;
    lastEvent;
    lastEdit;
    lastApiTry;
    lastScript;
    isQueued;
    callback;
    lines;
    instances;
    endpoints;
    constructor(apiUrl = "https://luaobfuscator.com/api/ide/", sessionId = null, tokens = [], lineCount = 0, lastEvent = 0, lastEdit = 0, lastApiTry = null, lastScript = null, isQueued = false, callback = null, lines = null, instances = null, endpoints = {
        session: "?session=",
        initf: "init?f=",
        obfuscateAll: "obfuscateAll/",
        obfuscate: "obfuscate/",
        sessions: "sessions/",
        cleanup: "cleanup/"
    }) {
        this.apiUrl = apiUrl;
        this.sessionId = sessionId;
        this.tokens = tokens;
        this.lineCount = lineCount;
        this.lastEvent = lastEvent;
        this.lastEdit = lastEdit;
        this.lastApiTry = lastApiTry;
        this.lastScript = lastScript;
        this.isQueued = isQueued;
        this.callback = callback;
        this.lines = lines;
        this.instances = instances;
        this.endpoints = endpoints;
    }
    init(callback, flags = 0, force = false, content = "") {
        this.lineCount = 0;
        this.lastEdit = 0;
        this.lastEvent = 0;
        this.instances = null;
        this.tokens = [];
        this.callback = callback;
        this.getSessionUrl();
        if (this.sessionId !== null) {
            self.editor.ToggleLoading();
            this.getScript((eventCode) => {
                if (eventCode === null)
                    return this.resetUrl();
                this.callback(eventCode);
                self.headerTabs.Update();
            });
        }
        else if (force) {
            self.editor.ToggleLoading();
            this.initScript(false, flags, content);
        }
    }
    initFromUrl(callback) {
        self.editor.ToggleLoading();
        const url = new URL(window.location.href);
        self.$.getJSON(url.searchParams.get("file"), (data) => {
            this.tokens = data;
            callback();
        });
    }
    getSessionId() { return this.sessionId; }
    getSessionUrl() {
        this.sessionId = new URLSearchParams(window.location.search).get("session");
        return this.sessionId;
    }
    setSessionUrl() {
        const url = new URLSearchParams(window.location.search);
        url.delete("session");
        url.append("session", this.sessionId);
        window.location.search = url.toString();
    }
    resetUrl() {
        const url = new URLSearchParams(window.location.search);
        url.delete("session");
        window.location.search = _.toString(url);
    }
    async getScript(callback) {
        await self.$.ajax({
            url: `${this.apiUrl}${this.endpoints.session}${this.sessionId}`,
            error: (err) => {
                const error = err;
                self.errorHandler.Error({ ajaxError: error, message: `Error while requesting script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` });
                this.resetUrl();
            },
        }).then(res => {
            const script = res;
            this.tokens = script.tokens;
            if (!_.isNull(script.message)) {
                if (!_.isNull(script.message)) {
                    self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } });
                    self.editor.ToggleLoading(false);
                }
                if (_.isFunction(callback))
                    callback(-1);
                return;
            }
            if (!callback)
                return;
            if (script.tokens) {
                window.states.windowState = true;
                callback(-1);
            }
            else
                callback(null);
        });
        self.editor.ToggleLoading();
    }
    async initScript(reset, flag = 0, content = "") {
        await self.$.ajax({
            url: `${this.apiUrl}${this.endpoints.initf}${flag}`,
            method: "POST",
            data: content,
            error: (err) => {
                const error = err;
                self.errorHandler.Error({ ajaxError: error, message: `Error while initializing script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` });
            },
        }).then(res => {
            const script = res;
            this.sessionId = script.sessionId;
            if (!reset)
                this.setSessionUrl();
        });
        self.editor.ToggleLoading();
    }
    resetScript(flag = 0) {
        this.initScript(true, flag);
    }
    updateLastTick() {
        this.lastApiTry = misc.getTick();
    }
    async updateScript(script, callback) {
        let tick = misc.getTick();
        if (this.lastApiTry + 2000 > tick) {
            this.lastApiTry = tick;
            this.lastScript = script;
            if (!this.isQueued) {
                this.isQueued = true;
                console.log(`queue: ${this.isQueued}`);
                function wait() {
                    tick = new Date().getTime();
                    if (this.lastApiTry + 2000 > tick) {
                        console.log("new wait...");
                        setTimeout(wait, 500);
                        return;
                    }
                    this.updateScript(this.lastScript, callback);
                    console.log("isQueued = false");
                    this.isQueued = false;
                    this.lastScript = null;
                }
                wait();
            }
            console.log("waiting...");
            return;
        }
        this.lastEvent = tick;
        this.lastApiTry = tick;
        console.log(`new event: ${tick}`);
        await self.$.ajax({
            url: this.apiUrl,
            method: "POST",
            data: script,
            headers: {
                "sessionId": this.sessionId
            },
            error: (err) => {
                const error = err;
                self.errorHandler.Error({ ajaxError: error, message: `Error while updating script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` });
            },
        }).then(res => {
            const script = res;
            this.tokens = script.tokens;
            if (!_.isNull(script.message)) {
                self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } });
            }
            if (_.isFunction(callback))
                callback(tick);
        });
        self.editor.ToggleLoading(false);
    }
    async Obfuscate(option, percent, callback) {
        self.editor.StartObfuscation();
        await self.$.ajax({
            url: `${this.apiUrl}${this.endpoints.obfuscateAll}${option}/${percent}`,
            method: "POST",
            headers: {
                "sessionId": this.sessionId
            },
            error: (err) => {
                const error = err;
                self.errorHandler.Error({ ajaxError: error, message: `Error while obfuscating script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` });
                self.editor.StopObfuscation();
            },
        }).then(res => {
            const script = res;
            this.tokens = script.tokens;
            if (!_.isNull(script.message)) {
                self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } }, false);
                self.editor.ToggleLoading(false);
            }
            if (_.isFunction(callback))
                callback(-1);
        }).done(() => {
            console.log("obfuscation done");
        });
        self.editor.StopObfuscation();
        self.editor.ToggleLoading(false);
    }
    obfuscateToken(tokenId, callback) {
        self.$.ajax({
            url: `${this.apiUrl}/${this.endpoints.obfuscate}/${tokenId}`,
            method: "POST",
            headers: {
                "sessionId": this.sessionId
            },
            error: (err) => {
                const error = err;
                self.errorHandler.Error({ ajaxError: error, message: `Error while obfuscating script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` });
            },
        }).then(res => {
            const script = res;
            this.tokens = script.tokens;
            if (!_.isNull(script.message))
                self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } });
            if (_.isFunction(callback))
                callback(-1);
        });
    }
    async getInstances() {
        await self.$.ajax({
            url: `${this.apiUrl}${this.endpoints.sessions}`,
            method: "GET",
            error: (err) => {
                const error = err;
                self.errorHandler.Error({ ajaxError: error, message: `Unable to get instances.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` });
            },
        }).then(res => {
            this.instances = res;
        });
        return this.instances;
    }
    cleanUp(callback) {
        self.$.ajax({
            url: `${this.apiUrl}/${this.endpoints.cleanup}`,
            method: "POST",
            headers: {
                "sessionId": this.sessionId
            },
            error: (err) => {
                const error = err;
                self.errorHandler.Error({ ajaxError: error, message: `Error while cleaning up script.\nRequest state: ${error.state()}\nStatus code: ${error.status} (${error.statusText})` });
            },
        }).then(res => {
            const script = res;
            this.tokens = script.tokens;
            if (!_.isNull(script.message)) {
                self.errorHandler.Error({ message: script.message, misc: { sessionId: script.sessionId } });
                self.editor.ToggleLoading(false);
            }
            if (_.isFunction(callback))
                callback(-1);
        });
    }
    onVariableChange(event) {
        const target = event.target, classes = target.className.split(' '), newName = target.textContent, spans = document.getElementsByClassName(classes[0]);
        for (var i = 0; i < spans.length; i++) {
            if (spans[i] == target)
                continue;
            spans[i].textContent = newName.replace(/\s+/gm, "_").replace(/[^\w \xC0-\xFF]+|\s+|^\s*$/gm, "_").trim(); // Snakecase
            //spans[i].textContent = misc.toCamelCase(newName.trim()).replace(/[^\w \xC0-\xFF]+|\s+|^\s*$/gm, "_").replace(/\s+/gm, "_") // Camelcase
        }
    }
    parseScript(targetElement, tick) {
        console.log(`finish event: ${tick}`);
        if (!this.tokens || this.tokens.length == 0 || (tick != -1 && (tick != this.lastEvent || tick != this.lastApiTry)))
            return;
        targetElement.innerHTML = "";
        if (this.tokens.length > 100000000) {
            let str = "";
            this.tokens.forEach((token, i) => {
                str.concat(token.value);
            });
            targetElement.innerHTML = str;
        }
        else {
            this.tokens.forEach((token, i) => {
                if (i > 100000000) {
                    targetElement.innerHTML += token.value;
                }
                else {
                    var addNoteClass = "";
                    switch (token.type) {
                        case 0:
                        case 1:
                            addNoteClass = "";
                            break;
                        case 2:
                            addNoteClass = "c_green";
                            break;
                        case 3:
                            addNoteClass = "c_white";
                            break;
                        case 4:
                            addNoteClass = "c_blue";
                            break;
                        case 5:
                            addNoteClass = "c_purple";
                            break;
                        case 6:
                            addNoteClass = "c_pink";
                            break;
                        case 7:
                            addNoteClass = "c_yellow";
                            break;
                        case 8:
                            addNoteClass = "";
                            break;
                    }
                    const newSpan = document.createElement("span");
                    if (token.xref != 0) {
                        addNoteClass = "c_ref-" + token.xref + " " + addNoteClass;
                        newSpan.contentEditable = "true";
                        newSpan.addEventListener("input", this.onVariableChange);
                        newSpan.addEventListener("focusout", (e) => {
                            const target = e.target;
                            target.textContent = target.textContent.replace(/[^\w \xC0-\xFF]+|\s+|^\s*$/gm, "_").trim(); // Snakecase
                            //target.textContent = misc.toCamelCase(target.textContent.trim()).replace(/[^\w \xC0-\xFF]+|\s+|^\s*$/gm, "_").replace(/\s+/gm, "_") // Camelcase
                        });
                        var hexstr = "";
                        let date = new Date();
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        if (month === 2 && day === 14) {
                            var hexstr = misc.getRandomHex((token.xref * 13) % 360, 360, 300, 360, 30, 100, 30, 100);
                        }
                        else if (month == 6) {
                            var hexstr = misc.getRandomHex((token.xref * 13) % 360, 360, 0, 360, 100, 100, 60, 70);
                        }
                        else if (month == 10 && day == 31) {
                            var hexstr = misc.getRandomHex((token.xref * 13) % 360, 360, 20, 40, 100, 100, 60, 80);
                        }
                        if (hexstr != "") {
                            newSpan.style.color = `#${hexstr} !important`;
                            newSpan.style.textShadow = `0 0 4px #${hexstr}AF;"`;
                        }
                    }
                    if (addNoteClass != "") {
                        newSpan.className = addNoteClass;
                    }
                    newSpan.className = addNoteClass;
                    newSpan.classList.add("ctoken");
                    newSpan.appendChild(document.createTextNode(token.value));
                    newSpan.id = "token-" + i;
                    targetElement.append(newSpan);
                }
            });
        }
        return true;
    }
    getLines() { this.lines = self.$(".ctoken"); return this.lines; }
}
