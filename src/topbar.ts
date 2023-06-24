import { Dialog,
        //  fetchSyncPost,
        //  openTab
} from "siyuan";
import { insert, insertButton, insertDocButton } from "./createIndex";
import { i18n, plugin } from "./utils";
import SettingsTab from "./components/setting.svelte"
import { settings } from "./settings";

// //tab类型
// const TAB_TYPE = "custom_tab";

export async function initTopbar() {

    //添加顶栏按钮
    const topBarElement = plugin.addTopBar({
        icon: "iconList",
        title: i18n.addTopBarIcon,
        position: "right",
        callback: async () => {
            insert();
        }
    });

    //添加快捷键
    plugin.addCommand({
        langKey: "addTopBarIcon",
        hotkey: "⌥⌘I",
        callback: async () => {
            insert();
        }
    });

    //设置右键监听
    topBarElement.addEventListener("contextmenu", async () => {
        await createDialog();
    });

        // //载入配置
    // await settings.load();

    // //创建一个div节点，将设置界面的svelte导入其中
    // let settingsTab: SettingsTab;
    // let div: HTMLDivElement = document.createElement('div');
    // settingsTab = new SettingsTab({
    //     target: div,
    // });

    // // openTab方法的fn参数
    // let customTab = plugin.addTab({
    //     type: TAB_TYPE,
    //     async init() {
    //         this.element.appendChild(div);
    //     },
    //     destroy() {
    //     }
    // });

    // topBarElement.addEventListener("contextmenu", () => {
    //     addMenu(topBarElement.getBoundingClientRect());
    // });

    // //设置右键监听
    // topBarElement.addEventListener("contextmenu", async () => {
    //     openTab({
    //         app:plugin.app,
    //         custom: {
    //             icon: "iconSettings",
    //             title: i18n.settingsTab.name,
    //             // data: {
    //             //     text: "This is my custom tab",
    //             // },
    //             fn: customTab
    //         },
    //     })
    // });

}

export async function createDialog() {
    //载入配置
    await settings.load();

    const settingsDialog = "index-settings"

    const dialog = new Dialog({
        title: i18n.settingsTab.name,
        content: `<div id="${settingsDialog}">`,
        width:"80%",
        height: "80%",
    });
    let settingsTab: SettingsTab;
    let div: HTMLDivElement = dialog.element.querySelector(`#${settingsDialog}`);

    settingsTab = new SettingsTab({
        target: div,
        props:{
            onSubOutlineButton:()=>{insertButton(dialog)},
            onDocOutlineButton:()=>{insertDocButton(dialog)}
        }
    });
}