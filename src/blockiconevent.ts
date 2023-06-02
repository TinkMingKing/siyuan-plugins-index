import { fetchSyncPost } from "siyuan";
import { log } from "./utils";

export function buildDoc({ detail }: any) {
    log(detail);
    detail.menu.addItem({
        icon: "iconList",
        label: "目录插件",
        click: () => {
            parseBlockDOM(detail);
        }
    });
}

function parseBlockDOM(detail: any) {
    if (detail.blockElements.length > 1) {
        return;
    }
    let notebookId = detail.protyle.notebookId;
    let hpath = detail.protyle.path;
    let block = detail.blockElements[0].childNodes;
    parseChildNodes(notebookId,hpath,block);
}

async function parseChildNodes(notebookId:string,hpath:string,childNodes: any) {
    for (const childNode of childNodes) {
        if (childNode.getAttribute('data-type') == "NodeListItem") {
            // console.log("if NodeListItem:");
            let sChildNodes = childNode.childNodes;
            for (const sChildNode of sChildNodes) {
                // console.log("for 2:");
                if (sChildNode.getAttribute('data-type') == "NodeParagraph") {
                    let text = window.Lute.BlockDOM2Content(sChildNode.innerHTML);
                    let blockId = await createDoc(notebookId,hpath,text);
                    let html = `* [${text}](siyuan://blocks/${blockId})`;
                    console.log(text);
                } else if (sChildNode.getAttribute('data-type') == "NodeList") {
                    parseChildNodes(notebookId,hpath,sChildNode.childNodes);
                }
            }
        }
    }
}

async function createDoc(notebookId:string,hpath:string,text:string){
    let response = await fetchSyncPost(
        "/api/filetree/createDocWithMd",
        {
            notebook: notebookId,
            path: hpath,
            markdown: text
        }
          
    );
    return response.data;
}