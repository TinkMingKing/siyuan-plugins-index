import { log } from "./utils";

export function buildDoc({ detail }: any) {
    log(detail);
    detail.menu.addItem({
        icon: "iconList",
        label: "目录插件",
        click: () => {}
    });
}