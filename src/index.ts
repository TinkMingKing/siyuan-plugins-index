import { Plugin } from "siyuan";
import { setI18n, setPlugin } from "./utils";
import { createDialog, initTopbar } from "./topbar";
import { settings } from "./settings";
import { buildDoc } from "./blockiconevent";
import { updateIndex } from "./protyleevent";

export default class IndexPlugin extends Plugin {

    async onload() {
        console.log("IndexPlugin onload");
        this.init();
        await initTopbar();
        await settings.initData();
        //监听块菜单事件
        this.eventBus.on("click-blockicon", buildDoc);
        this.eventBus.on("loaded-protyle", updateIndex);
        
    }

    onunload() {
        console.log("IndexPlugin onunload");
    }

    // async openSetting(){
    //     await createDialog();
    // }

    init(){
        setI18n(this.i18n);
        setPlugin(this);
    }

    // private eventBusLog({detail}: any) {
    //     console.log(detail);
    // }

}