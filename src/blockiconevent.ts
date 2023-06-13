import { fetchSyncPost } from "siyuan";
import { IndexNode, IndexStack } from "./indexnode";
import { getParentDoc } from "./createIndex";
import { settings } from "./settings";
import { i18n } from "./utils";

let indexStack : IndexStack;

export function buildDoc({ detail }: any) {
    if (detail.blockElements.length > 1 || 
        detail.blockElements[0].getAttribute('data-type') != "NodeList" || !settings.get("docBuilder")) {
        return;
    }
    // console.log(detail);
    detail.menu.addItem({
        icon: "iconList",
        label: i18n.settingsTab.items.docBuilder.title,
        click: async () => {
            await parseBlockDOM(detail);
        }
    });
}

async function parseBlockDOM(detail: any) {
    indexStack = new IndexStack();
    indexStack.notebookId = detail.protyle.notebookId;
    let docId = detail.blockElements[0].getAttribute("data-node-id");
    let block = detail.blockElements[0].childNodes;
    indexStack.basePath = await getRootDoc(docId);
    let docData = await getParentDoc(detail.protyle.block.rootID);
    indexStack.pPath = docData[1].slice(0, -3);
    await parseChildNodes(block,indexStack);
    await stackPopAll(indexStack);
    window.location.reload();
}

async function parseChildNodes(childNodes: any,pitem:IndexStack, tab = 0) {
    tab++;
    let newItem: IndexStack;
    for (const childNode of childNodes) {
        if (childNode.getAttribute('data-type') == "NodeListItem") {
            // console.log("if NodeListItem:");
            let sChildNodes = childNode.childNodes;
            for (const sChildNode of sChildNodes) {
                // console.log("for 2:");
                if (sChildNode.getAttribute('data-type') == "NodeParagraph") {
                    //获取文档标题
                    let text = window.Lute.BlockDOM2Content(sChildNode.innerHTML);
                    //创建文档
                    let item = new IndexNode(tab,text);
                    pitem.push(item);
                    newItem = item.children;
                    // await createDoc(notebookId,hpath);
                    // console.log(tab+":"+text);
                } else if (sChildNode.getAttribute('data-type') == "NodeList") {
                    await parseChildNodes(sChildNode.childNodes,newItem,tab); 
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

async function createDoc(notebookId:string,hpath:string){
    let response = await fetchSyncPost(
        "/api/filetree/createDocWithMd",
        {
            notebook: notebookId,
            path: hpath,
            markdown: ""
        }
          
    );
    return response.data;
}

async function stackPopAll(stack:IndexStack){
    let item : IndexNode;
    let temp = new IndexStack();
    while(!stack.isEmpty()){
        item = stack.pop();
        
        let subPath = stack.basePath+"/"+item.text;

        //同级目录等待返回，并延迟1s，避免数据库写入延迟的影响，确保不乱序
        item.path = await createDoc(indexStack.notebookId, subPath);
        item.path = stack.pPath + "/" + item.path
        temp.push(item);
        if(!item.children.isEmpty()){
            item.children.basePath = subPath;
            item.children.pPath = item.path;
            await stackPopAll(item.children);
            // stackPopAll(item.children); //可能更快
        }
    }
    temp.pPath = stack.pPath;
    await sortDoc(temp);
    console.log("ok");
}

async function sortDoc(item : IndexStack){
    //构建真实顺序
    let paths = [];
    while(!item.isEmpty()){
        paths.push(item.pop().path+".sy");
    }
    await requestChangeSort(paths,indexStack.notebookId);
}

async function requestChangeSort(paths:any[],notebook:string){
    await fetchSyncPost(
        "/api/filetree/changeSort",
        {
            paths: paths,
            notebook: notebook
        }
    );
}