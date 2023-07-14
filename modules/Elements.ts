export default class Elements {
    constructor(
        public home_landingpage: HTMLElement = document.querySelector("#home-landingpage"),
        public home_landing: HTMLElement = document.querySelector("#home-landing"),
        public btn_demo: HTMLElement = document.querySelector("#btn-demo"),
        public codewindow: HTMLElement = document.querySelector("#lua-codewindow"),
        public ide: HTMLElement = document.querySelector("#home-ide"),
        public toolbox: HTMLElement = document.querySelector("#notepad-toolbox1"),
        public btn_uploadfile: HTMLElement = document.querySelector("#btn-uploadfile"),
        public lua_file: HTMLElement = document.querySelector("#lua-file"),
        public lua_sessions: HTMLElement = document.querySelector("#lua-sessions"),
        public cookie_popup: HTMLElement = document.querySelector(".cookie-popup"),
        public cookie_reject_btn: HTMLElement = document.querySelector("#cookie-reject-btn"),
        public cookie_accept_btn: HTMLElement = document.querySelector("#cookie-accept-btn"),
    ) { }
}