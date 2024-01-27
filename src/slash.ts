import { Protyle } from "siyuan";
import { plugin } from "./utils";

export function addSlash() {
    plugin.protyleSlash = [{
        filter: ["insert emoji 😊", "插入表情 😊", "crbqwx"],
        html: `<div class="b3-list-item__first"><span class="b3-list-item__text">${this.i18n.insertEmoji}</span><span class="b3-list-item__meta">😊</span></div>`,
        id: "insertEmoji",
        callback(protyle: Protyle) {
            protyle.insert("😊");
        }
    }];
}