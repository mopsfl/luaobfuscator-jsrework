export default class Elements {
    constructor(
        public home_landingpage: HTMLElement = document.querySelector("#home-landingpage"),
        public home_landing: HTMLElement = document.querySelector("#home-landing"),
        public btn_demo: HTMLElement = document.querySelector("#btn-demo"),
        public codewindow: HTMLElement = document.querySelector("#lua-codewindow"),
        public ide: HTMLElement = document.querySelector("#home-ide"),
        public toolbox: HTMLElement = document.querySelector("#notepad-toolbox1")
    ) { }
}