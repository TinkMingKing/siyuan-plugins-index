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
    let pblockId = detail.blockElements[0].getAttribute('data-node-id');
    let block = detail.blockElements[0].childNodes;
    parseChildNodes(block);
}

function parseChildNodes(childNodes: any) {
    for (const childNode of childNodes) {
        if (childNode.getAttribute('data-type') == "NodeListItem") {
            // console.log("if NodeListItem:");
            let sChildNodes = childNode.childNodes;
            for (const sChildNode of sChildNodes) {
                // console.log("for 2:");
                if (sChildNode.getAttribute('data-type') == "NodeParagraph") {
                    console.log(window.Lute.BlockDOM2Content(sChildNode.innerHTML));
                } else if (sChildNode.getAttribute('data-type') == "NodeList") {
                    parseChildNodes(sChildNode.childNodes);
                }
            }
        }
    }
}

// function parseChildNodes(childNodes:any){
//         console.log("parseChildNodes function:")
//         for (const childNode of childNodes) {
//             // console.log("for 1:"+childNode.getAttribute('data-type'));
//             if(childNode.getAttribute('data-type') == "NodeListItem"){
//                 // console.log("if NodeListItem:");
//                 let sChildNodes = childNode.childNodes;
//                 for (const sChildNode of sChildNodes) {
//                     // console.log("for 2:");
//                     if(sChildNode.getAttribute('data-type') == "NodeParagraph"){
//                         console.log(window.Lute.BlockDOM2Content(sChildNode.innerHTML));
//                     } else if(sChildNode.getAttribute('data-type') == "NodeList"){
//                         let sChildNodes = sChildNode.childNodes;
//                         for(const sChildNode of sChildNodes){
//                             if(sChildNode.getAttribute('data-type') == "NodeListItem"){
//                                 parseChildNodes(sChildNodes);
//                             } else if(sChildNode.getAttribute('data-type') == "NodeParagraph"){
//                                 console.log(window.Lute.BlockDOM2Content(sChildNode.innerHTML));
//                             }
//                         }
//                     }
//                 }
//             }
//         }
// }