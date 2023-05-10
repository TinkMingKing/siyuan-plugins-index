import {Plugin} from "siyuan";
import { main } from "./createIndex";
import "./index.scss";

export default class PluginSample extends Plugin {

    onload() {
        console.log(this.i18n.helloPlugin);

        this.eventBus.on("ws-main", this.wsEvent);

        this.addTopBar({
            icon: "iconList",
            title: this.i18n.addTopBarIcon,
            position: "right",
            callback: () => {
                main(this.i18n.errorMsg_empty, this.i18n.errorMsg_miss);
            }
        });

    }

    onunload() {
        console.log(this.i18n.byePlugin);
    }

    private wsEvent({detail}: any) {
        console.log(detail);
    }
}