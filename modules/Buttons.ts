export default class Buttons {
    OpenDemo() {
        if (!window.states.isObfuscating) window.luaEngine.init(() => { }, 1, true)
    }
}