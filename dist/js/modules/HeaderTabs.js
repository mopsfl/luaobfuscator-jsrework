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
    async Update() {
        const instances = await self.luaEngine.getInstances();
        self.elements.lua_sessions.innerHTML = "";
        this.CreateTab("Home");
        instances.forEach(s => {
            this.CreateTab(s, `./${self.luaEngine.endpoints.session}${s}`);
        });
        return instances;
    }
}
