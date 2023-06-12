import { fetchSyncPost } from "siyuan";

export function buildDoc({ detail }: any) {
    console.log(detail);
    detail.menu.addItem({
        icon: "iconList",
        label: "目录插件",
        click: async () => {
            await parseBlockDOM(detail);
        }
    });
}

async function parseBlockDOM(detail: any) {
    if (detail.blockElements.length > 1) {
        return;
    }
    let notebookId = detail.protyle.notebookId;
    let docId = detail.blockElements[0].getAttribute("data-node-id");
    let block = detail.blockElements[0].childNodes;
    await parseChildNodes(notebookId,docId,block);
}

async function parseChildNodes(notebookId:string,hpath:string,childNodes: any) {
    for (const childNode of childNodes) {
        if (childNode.getAttribute('data-type') == "NodeListItem") {
            // console.log("if NodeListItem:");
            let sChildNodes = childNode.childNodes;
            let blockId = "";
            for (const sChildNode of sChildNodes) {
                // console.log("for 2:");
                if (sChildNode.getAttribute('data-type') == "NodeParagraph") {
                    //获取文档标题
                    let text = window.Lute.BlockDOM2Content(sChildNode.innerHTML);
                    //获取hpath
                    let shpath = await getRootDoc(hpath);
                    //创建文档
                    blockId = await createDoc(notebookId,shpath,text);
                    let html = `* [${text}](siyuan://blocks/${blockId})`;
                    console.log(text);
                } else if (sChildNode.getAttribute('data-type') == "NodeList") {
                    setTimeout(async () => {
                        await parseChildNodes(notebookId,blockId,sChildNode.childNodes); 
                    }, 3000);
                }
            }
        }
    }
}

async function getRootDoc(id:string){
    
    let response = await fetchSyncPost(
        "/api/query/sql",
        {
            stmt: `SELECT * FROM blocks WHERE id = '${id}'`
        }
    );
    let result = response.data[0];
    return result?.hpath;
}

async function createDoc(notebookId:string,hpath:string,text:string){
    let response = await fetchSyncPost(
        "/api/filetree/createDocWithMd",
        {
            notebook: notebookId,
            path: hpath + "/" + text,
            markdown: ""
        }
          
    );
    return response.data;
}