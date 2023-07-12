import * as self from "../index";
export default class HeaderTabs {
    constructor() { }
    CreateTab(Text = "-", href = "/") {
        const tab = document.createElement("span");
        const text = document.createElement("span");
        const link = document.createElement("a");
        const listItem = document.createElement("li");
        text.innerText = Text;
        listItem.className = "top-tab";
        listItem.style.width = "auto";
        self.elements.lua_sessions.appendChild(listItem);
        tab.classList.add("top-tab-close");
        link.href = href;
        listItem.appendChild(link);
        listItem.appendChild(tab);
        link.appendChild(text);
    }
    ClearTabs() { self.elements.lua_sessions.innerHTML = ""; }
    async Update() {
        const instances = await self.luaEngine.getInstances();
        this.ClearTabs();
        this.CreateTab("Home", location.pathname);
        if (!instances)
            return self.errorHandler.Error({ message: "Unable to get session instances." });
        instances.forEach(s => {
            this.CreateTab(s, `./${self.luaEngine.endpoints.session}${s}`);
        });
        return instances;
    }
}
