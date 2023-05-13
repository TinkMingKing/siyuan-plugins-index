import { Menu, Plugin, isMobile } from "siyuan";
import { main } from "./createIndex";
import "./index.scss";

const STORAGE_MENU = "menu-config-icon";
export default class IndexPlugin extends Plugin {

    onload() {
        console.log(this.i18n.helloPlugin);

        const topBarElement = this.addTopBar({
            icon: "iconList",
            title: this.i18n.addTopBarIcon,
            position: "right",
            callback: async () => {
                await this.loadData(STORAGE_MENU);
                main(this.i18n,this.data);
            }
        });
        topBarElement.addEventListener("contextmenu", () => {
            this.addMenu(topBarElement.getBoundingClientRect());
        });

    }

    onunload() {
        console.log(this.i18n.byePlugin);
    }

    private async addMenu(rect: DOMRect) {
        console.log(this.data);
        await this.loadData(STORAGE_MENU);
        console.log("this.data");
        if (this.data[STORAGE_MENU] == "")
            this.saveData(STORAGE_MENU, true);

        const menu = new Menu("topBarSample", () => {
            console.log(this.i18n.byeMenu);
            this.saveData(STORAGE_MENU, this.data[STORAGE_MENU]);
        });


        menu.addItem({
            icon: "iconSettings",
            label: "Settings",
            type: "readonly",
        });

        menu.addSeparator();

        menu.addItem({
            icon: this.data[STORAGE_MENU]=="true" ? "iconClose":"iconSelect",
            label: this.data[STORAGE_MENU]=="true" ? this.i18n.icon_disable : this.i18n.icon_enable,
            click: () => {
                console.log(typeof(this.data[STORAGE_MENU]));
                console.log("123");
                if(this.data[STORAGE_MENU] == "true"){
                    this.data[STORAGE_MENU] = false;
                }else if(this.data[STORAGE_MENU] == "false"){
                    this.data[STORAGE_MENU] = true;
                }
            }
        });

        if (isMobile()) {
            menu.fullscreen();
        } else {
            menu.open({
                x: rect.right,
                y: rect.bottom,
                isLeft: true,
            });
        }
    }

}