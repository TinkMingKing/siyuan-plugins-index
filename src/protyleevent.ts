import { insertAuto } from "./createIndex";
import { isMobile } from "./utils";
// import { settings } from "./settings";

export function updateIndex({ detail }: any) {
    if (!isMobile) {
        if(
            // detail.model == undefined || 
            detail.block.showAll){
            // || !settings.get("autoUpdate")
            return;
        }
    }
    console.log(detail);
    let notebookId = detail.notebookId;
    let path = detail.path;
    let parentId = detail.block.rootID;
    insertAuto(notebookId,path,parentId);
}