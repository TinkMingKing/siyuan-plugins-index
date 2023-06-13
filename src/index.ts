import { Plugin } from "siyuan";
import { setI18n, setPlugin } from "./utils";
import { initTopbar } from "./topbar";
import { settings } from "./settings";
import { buildDoc } from "./blockiconevent";

export default class IndexPlugin extends Plugin {

    async onload() {
        console.log("IndexPlugin onload");
        this.init();
        await settings.initData();
        await initTopbar();
        //监听块菜单事件
        this.eventBus.on("click-blockicon", buildDoc);
        
    }

    onunload() {
        console.log("IndexPlugin onunload");
    }

    init(){
        setI18n(this.i18n);
        setPlugin(this);
    }

}