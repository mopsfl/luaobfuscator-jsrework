export default class Elements {
    home_landingpage;
    home_landing;
    btn_demo;
    codewindow;
    ide;
    toolbox;
    btn_uploadfile;
    lua_file;
    lua_sessions;
    cookie_popup;
    cookie_reject_btn;
    cookie_accept_btn;
    constructor(home_landingpage = document.querySelector("#home-landingpage"), home_landing = document.querySelector("#home-landing"), btn_demo = document.querySelector("#btn-demo"), codewindow = document.querySelector("#lua-codewindow"), ide = document.querySelector("#home-ide"), toolbox = document.querySelector("#notepad-toolbox1"), btn_uploadfile = document.querySelector("#btn-uploadfile"), lua_file = document.querySelector("#lua-file"), lua_sessions = document.querySelector("#lua-sessions"), cookie_popup = document.querySelector(".cookie-popup"), cookie_reject_btn = document.querySelector("#cookie-reject-btn"), cookie_accept_btn = document.querySelector("#cookie-accept-btn")) {
        this.home_landingpage = home_landingpage;
        this.home_landing = home_landing;
        this.btn_demo = btn_demo;
        this.codewindow = codewindow;
        this.ide = ide;
        this.toolbox = toolbox;
        this.btn_uploadfile = btn_uploadfile;
        this.lua_file = lua_file;
        this.lua_sessions = lua_sessions;
        this.cookie_popup = cookie_popup;
        this.cookie_reject_btn = cookie_reject_btn;
        this.cookie_accept_btn = cookie_accept_btn;
    }
}
