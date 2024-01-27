import { IndexStackNode, IndexStack } from "./indexnode";
import { insertAfter } from "./createIndex";
import { settings } from "./settings";
import { client, i18n } from "./utils";

//目录栈
let indexStack : IndexStack;

/**
 * 块标菜单回调
 * @param detail 事件细节
 * @returns void
 */
export function buildDoc({ detail }: any) {
    //如果选中块大于1或不是列表块或未开启按钮，则直接结束
    if (detail.blockElements.length > 1 || 
        detail.blockElements[0].getAttribute('data-type') != "NodeList" ||
        !settings.get("docBuilder")) {
        return;
    }
    //插入按钮到块菜单
    detail.menu.addItem({
        icon: "iconList",
        label: i18n.settingsTab.items.docBuilder.title,
        click: async () => {
            await parseBlockDOM(detail);
        }
    });
}

/**
 * 解析detail中块的DOM
 * @param detail 
 */
async function parseBlockDOM(detail: any) {
    // console.log(detail);
    indexStack = new IndexStack();
    indexStack.notebookId = detail.protyle.notebookId;
    let docId = detail.blockElements[0].getAttribute("data-node-id");
    let block = detail.blockElements[0].childNodes;
    indexStack.basePath = await getRootDoc(docId);
    let docData = await client.getBlockInfo({
        id: detail.protyle.block.rootID
    });
    // let docData = await getParentDoc(detail.protyle.block.rootID);
    indexStack.pPath = docData.data.path.slice(0, -3);
    await parseChildNodes(block,indexStack);
    await stackPopAll(indexStack);
    await insertAfter(indexStack.notebookId,docId,docData.data.path);
    // window.location.reload();
}

async function parseChildNodes(childNodes: any,pitem:IndexStack, tab = 0) {
    tab++;
    let newItem: IndexStack;
    for (const childNode of childNodes) {
        if (childNode.getAttribute('data-type') == "NodeListItem") {
            let sChildNodes = childNode.childNodes;
            for (const sChildNode of sChildNodes) {
                if (sChildNode.getAttribute('data-type') == "NodeParagraph") {
                    //获取文档标题
                    let text = window.Lute.BlockDOM2Content(sChildNode.innerHTML);
                    // console.log(text);
                    //创建文档
                    let item = new IndexStackNode(tab,text);
                    pitem.push(item);
                    newItem = item.children;
                } else if (sChildNode.getAttribute('data-type') == "NodeList") {
                    await parseChildNodes(sChildNode.childNodes,newItem,tab); 
                }
            }
        }
    }
}

/**
 * 获取文档块路径
 * @param id 文档块id
 * @returns 文档块路径
 */
async function getRootDoc(id:string){

    let response = await client.sql({
        stmt: `SELECT * FROM blocks WHERE id = '${id}'`
    });
    
    let result = response.data[0];
    return result?.hpath;
}

/**
 * 创建文档
 * @param notebookId 笔记本id
 * @param hpath 文档路径
 * @returns 响应内容
 */
async function createDoc(notebookId:string,hpath:string){

    let response = await client.createDocWithMd({
        markdown: "",
        notebook: notebookId,
        path: hpath
    });
    return response.data;

}

/**
 * 全部出栈
 * @param stack 目录栈
 */
async function stackPopAll(stack:IndexStack){
    let item : IndexStackNode;
    let temp = new IndexStack();
    while(!stack.isEmpty()){
        item = stack.pop();

        let text = item.text;

        // if(hasEmoji(text.slice(0,2))){
        //     text = text.slice(3);
        // }
        
        let subPath = stack.basePath+"/"+text;

        item.path = await createDoc(indexStack.notebookId, subPath);
        item.path = stack.pPath + "/" + item.path
        temp.push(item);
        if(!item.children.isEmpty()){
            item.children.basePath = subPath;
            item.children.pPath = item.path;
            // await stackPopAll(item.children);
            stackPopAll(item.children); //可能更快
        }
    }
    temp.pPath = stack.pPath;
    // await sortDoc(temp);
}

// /**
//  * 文档排序
//  * @param item 文档id栈
//  */
// async function sortDoc(item : IndexStack){
//     //构建真实顺序
//     let paths = [];
//     while(!item.isEmpty()){
//         paths.push(item.pop().path+".sy");
//     }
//     await requestChangeSort(paths,indexStack.notebookId);
// }

// /**
//  * 排序请求
//  * @param paths 路径顺序
//  * @param notebook 笔记本id
//  */
// async function requestChangeSort(paths:any[],notebook:string){
//     await fetchSyncPost(
//         "/api/filetree/changeSort",
//         {
//             paths: paths,
//             notebook: notebook
//         }
//     );
// }