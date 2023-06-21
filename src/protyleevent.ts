import { insertAuto } from "./createIndex";
import { settings } from "./settings";

export function updateIndex({ detail }: any) {
    if (detail.options.mode != undefined || !settings.get("autoUpdate")) {
        console.log(detail);
        console.log("open");
        return;
    }
    console.log(detail);
    let notebookId = detail.notebookId;
    console.log(notebookId);
    let path = detail.path;
    let parentId = detail.options.blockId;
    insertAuto(notebookId,path,parentId);
    console.log("Auto update Index");
}