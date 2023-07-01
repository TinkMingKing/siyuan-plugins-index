import { Dialog, fetchSyncPost, showMessage } from 'siyuan';
import { escapeHtml, i18n, isMobile, plugin } from './utils';
import { CONFIG, settings } from './settings';
import { IndexQueue, IndexQueueNode } from './indexnode';

let indexQueue: IndexQueue;

/**
 * 点击topbar按钮插入目录
 * @returns void
 */
export async function insert() {
    //载入配置
    await settings.load();

    //寻找当前编辑的文档的id
    let parentId = getDocid();
    if (parentId == null) {
        showMessage(
            i18n.errorMsg_empty,
            3000,
            "error"
        );
        return;
    }

    //获取文档数据
    let [box, path] = await getParentDoc(parentId);

    //插入目录
    let data = '';
    indexQueue = new IndexQueue();
    await createIndex(box, path, indexQueue);
    data = queuePopAll(indexQueue, data);
    if (data != '') {
        await insertData(parentId, data);
    } else{
        showMessage(
            i18n.errorMsg_miss,
            3000,
            "error"
        );
    }
}

/**
 * 点击插入带大纲的目录
 * @returns void
 */
export async function insertButton(dialog: Dialog) {
    //载入配置
    await settings.load();

    settings.set("autoUpdate", false);

    //寻找当前编辑的文档的id
    let parentId = getDocid();
    if (parentId == null) {
        showMessage(
            i18n.errorMsg_empty,
            3000,
            "error"
        );
        return;
    }

    //获取文档数据
    let [box, path] = await getParentDoc(parentId);

    //插入目录
    let data = '';
    indexQueue = new IndexQueue();
    await createIndexandOutline(box, path, indexQueue);
    data = queuePopAll(indexQueue, data);
    if (data != '') {
        await insertDataSimple(parentId, data);
    } else {
        showMessage(
            i18n.errorMsg_miss,
            3000,
            "error"
        );
        return;
    }
    dialog.destroy();
}

/**
 * 点击插入大纲
 * @returns void
 */
export async function insertDocButton(dialog: Dialog) {
    //载入配置
    await settings.load();

    //寻找当前编辑的文档的id
    let parentId = getDocid();
    if (parentId == null) {
        showMessage(
            i18n.errorMsg_empty,
            3000,
            "error"
        );
        return;
    }

    //插入目录
    let data = '';

    let outlineData = await requestGetDocOutline(parentId);
    console.log(outlineData);
    data = insertOutline(data, outlineData, 0);

    if (data != '') {
        await fetchSyncPost(
            "/api/block/insertBlock",
            {
                data: data,
                dataType: "markdown",
                parentID: parentId
            }
        );
        showMessage(
            i18n.msg_success,
            3000,
            "info"
        );
    } else {
        showMessage(
            i18n.errorMsg_miss_outline,
            3000,
            "error"
        );
        return;
    }

    dialog.destroy();
}

/**
 * 文档构建器构建后插入目录
 * @param notebookId 笔记本id
 * @param parentId 目录块id
 * @param path 目录块path
 */
export async function insertAfter(notebookId: string, parentId: string, path: string) {
    //载入配置
    await settings.load();

    //插入目录
    let data = '';
    indexQueue = new IndexQueue();
    await createIndex(notebookId, path, indexQueue);
    data = queuePopAll(indexQueue, data);
    if (data != '') {
        await insertDataAfter(parentId, data);
    } else
        showMessage(
            i18n.errorMsg_miss,
            3000,
            "error"
        );
}

/**
 * 自动更新目录
 * @param notebookId 笔记本id 
 * @param path 目标文档路径
 * @param parentId 目标文档id
 */
export async function insertAuto(notebookId: string, path: string, parentId: string) {

    //载入配置
    await settings.load();

    let rs = await fetchSyncPost(
        "/api/query/sql",
        {
            stmt: `SELECT * FROM blocks WHERE root_id = '${parentId}' AND ial like '%custom-index-create%' order by updated desc limit 1`
        }
    );

    console.log(path);

    if (rs.data[0]?.id != undefined) {
        let ial = await fetchSyncPost(
            "/api/attr/getBlockAttrs",
            {
                id: rs.data[0].id
            }
        );
        //载入配置
        let str = ial.data["custom-index-create"];
        console.log(str);
        settings.loadSettings(JSON.parse(str));
        //插入目录
        let data = '';
        indexQueue = new IndexQueue();
        await createIndex(notebookId, path, indexQueue);
        data = queuePopAll(indexQueue, data);
        console.log(plugin.data)
        console.log("data=" + data)
        if (data != '') {
            await insertDataAfter(rs.data[0].id, data);
        } else
            showMessage(
                i18n.errorMsg_miss,
                3000,
                "error"
            );
    }

}

// //获取当前文档信息
// export async function getParentDoc(parentId: string) {

//     let response = await fetchSyncPost(
//         "/api/query/sql",
//         {
//             stmt: `SELECT * FROM blocks WHERE id = '${parentId}'`
//         }
//     );
//     let result = response.data[0];
//     // console.log(response);
//     //返回值为数组
//     let box = result.box;
//     let path = result.path;
//     return [box, path];
// }

//获取当前文档信息
export async function getParentDoc(parentId: string) {

    let response = await fetchSyncPost(
        "/api/block/getBlockInfo",
        {
            id: parentId
        }
    );
    let result = response.data;
    // console.log(response);
    //返回值为数组
    let box = result.box;
    let path = result.path;
    return [box, path];
}

//获取当前文档id
export function getDocid() {
    if (isMobile)
        return document.querySelector('#editor .protyle-content .protyle-background')?.getAttribute("data-node-id");
    else
        return document.querySelector('.layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background')?.getAttribute("data-node-id");
}

//获取子文档数据
export async function requestSubdoc(notebook: any, path: any) {
    let response = await fetchSyncPost(
        "/api/filetree/listDocsByPath",
        {
            notebook: notebook,
            path: path
        }
    );
    let result = response.data;
    if (result == null) return [];
    return result.files;
}

async function requestGetDocOutline(blockId: string) {
    let response = await fetchSyncPost(
        "/api/outline/getDocOutline",
        {
            id: blockId
        }
    );
    let result = response.data;
    if (result == null) return [];
    return result;
}

function insertOutline(data: string, outlineData: any[], tab: number) {

    tab++;

    //生成写入文本
    console.log("outlineData.length:" + outlineData.length)
    for (let outline of outlineData) {
        let id = outline.id;
        let name = "";
        if (outline.depth == 0) {
            name = outline.name;
        } else {
            name = outline.content;
        }

        // let icon = doc.icon;
        let subOutlineCount = outline.count;
        for (let n = 1; n < tab; n++) {
            data += '    ';
        }

        //转义
        name = escapeHtml(name);

        //应用设置
        let listType = settings.get("listType") == "unordered" ? true : false;
        if (listType) {
            data += "* ";
        } else {
            data += "1. ";
        }

        //置入数据
        let linkType = settings.get("linkType") == "ref" ? true : false;
        if (linkType) {
            data += `[@${name}](siyuan://blocks/${id})\n`;
        } else {
            data += `((${id} '@${name}'))\n`;
        }
        //`((id "锚文本"))`
        if (subOutlineCount > 0) {//获取下一层级子文档
            if (outline.depth == 0) {
                data = insertOutline(data, outline.blocks, tab);
            } else {
                data = insertOutline(data, outline.children, tab);
            }
        }

    }
    return data;
}



//处理图标
function getSubdocIcon(icon: string, hasChild: boolean) {
    if (icon == '' || icon == undefined) {
        return hasChild ? "📑" : "📄";
    } else if (icon.indexOf(".") != -1) {
        if (icon.indexOf("http://") != -1 || icon.indexOf("https://") != -1) {
            return hasChild ? "📑" : "📄";
        } else {
            // 移除扩展名
            let removeFileFormat = icon.substring(0, icon.lastIndexOf("."));
            return `:${removeFileFormat}:`;
        }
    } else {
        return String.fromCodePoint(parseInt(icon, 16));
    }
}

//创建目录
async function createIndexandOutline(notebook: any, ppath: any, pitem: IndexQueue, tab = 0) {

    if (settings.get("depth") == 0 || settings.get("depth") > tab) {

        let docs = await requestSubdoc(notebook, ppath);
        tab++;

        //生成写入文本
        for (let doc of docs) {

            let data = "";
            let id = doc.id;
            let name = doc.name.slice(0, -3);
            let icon = doc.icon;
            let subFileCount = doc.subFileCount;
            let path = doc.path;
            for (let n = 1; n < tab; n++) {
                data += '    ';
            }

            //转义
            name = escapeHtml(name);

            //应用设置
            let listType = settings.get("listType") == "unordered" ? true : false;
            if (listType) {
                data += "* ";
            } else {
                data += "1. ";
            }
            if (settings.get("icon")) {
                data += `${getSubdocIcon(icon, subFileCount != 0)} `;
            }

            //置入数据
            let linkType = settings.get("linkType") == "ref" ? true : false;
            if (linkType) {
                data += `[${name}](siyuan://blocks/${id})\n`;
            } else {
                data += `((${id} '${name}'))\n`;
            }
            let outlineData = await requestGetDocOutline(id);
            console.log(outlineData);
            data = insertOutline(data, outlineData, tab);

            console.log(data);
            let item = new IndexQueueNode(tab, data);
            pitem.push(item);
            //`((id "锚文本"))`
            if (subFileCount > 0) {//获取下一层级子文档
                await createIndex(notebook, path, item.children, tab);
            }

        }
    }

}

/**
 * 创建目录
 * @param notebook 笔记本id
 * @param ppath 父文档路径
 * @param data 数据
 * @param tab 深度
 * @returns 待插入数据
 */
async function createIndex(notebook: any, ppath: any, pitem: IndexQueue, tab = 0) {

    if (settings.get("depth") == 0 || settings.get("depth") > tab) {

        let docs = await requestSubdoc(notebook, ppath);
        tab++;

        //生成写入文本
        for (let doc of docs) {

            let data = "";
            let id = doc.id;
            let name = doc.name.slice(0, -3);
            let icon = doc.icon;
            let subFileCount = doc.subFileCount;
            let path = doc.path;
            for (let n = 1; n < tab; n++) {
                data += '    ';
            }

            //转义
            name = escapeHtml(name);

            //应用设置
            let listType = settings.get("listType") == "unordered" ? true : false;
            if (listType) {
                data += "* ";
            } else {
                data += "1. ";
            }
            if (settings.get("icon")) {
                data += `${getSubdocIcon(icon, subFileCount != 0)} `;
            }

            //置入数据
            let linkType = settings.get("linkType") == "ref" ? true : false;
            if (linkType) {
                data += `[${name}](siyuan://blocks/${id})\n`;
            } else {
                data += `((${id} '${name}'))\n`;
            }
            console.log(data);
            let item = new IndexQueueNode(tab, data);
            pitem.push(item);
            if (subFileCount > 0) {//获取下一层级子文档
                await createIndex(notebook, path, item.children, tab);
            }

        }
    }
}

//插入数据
async function insertData(id: string, data: string) {

    try {
        let rs = await fetchSyncPost(
            "/api/query/sql",
            {
                stmt: `SELECT * FROM blocks WHERE root_id = '${id}' AND ial like '%custom-index-create%' order by updated desc limit 1`
            }
        );
        if (rs.data[0]?.id == undefined) {
            let result = await fetchSyncPost(
                "/api/block/insertBlock",
                {
                    data: data,
                    dataType: "markdown",
                    parentID: id
                }
            );
            await fetchSyncPost(
                "/api/attr/setBlockAttrs",
                {
                    id: result.data[0].doOperations[0].id,
                    attrs: {
                        "custom-index-create": JSON.stringify(plugin.data[CONFIG])
                    }
                }
            );
            showMessage(
                i18n.msg_success,
                3000,
                "info"
            );
        } else {
            let result = await fetchSyncPost(
                "/api/block/updateBlock",
                {
                    data: data,
                    dataType: "markdown",
                    id: rs.data[0].id
                }
            );
            await fetchSyncPost(
                "/api/attr/setBlockAttrs",
                {
                    id: result.data[0].doOperations[0].id,
                    attrs: {
                        "custom-index-create": JSON.stringify(plugin.data[CONFIG])
                    }
                }
            );
            showMessage(
                i18n.update_success,
                3000,
                "info"
            );
        }
    } catch (error) {
        showMessage(
            i18n.dclike,
            3000,
            "error"
        );
    }


}

//插入数据
async function insertDataSimple(id: string, data: string) {

    await fetchSyncPost(
        "/api/block/insertBlock",
        {
            data: data,
            dataType: "markdown",
            parentID: id
        }
    );
    showMessage(
        i18n.msg_success,
        3000,
        "info"
    );

}

//插入数据
async function insertDataAfter(id: string, data: string) {

    let result = await fetchSyncPost(
        "/api/block/updateBlock",
        {
            data: data,
            dataType: "markdown",
            id: id
        }
    );
    await fetchSyncPost(
        "/api/attr/setBlockAttrs",
        {
            id: result.data[0].doOperations[0].id,
            attrs: {
                "custom-index-create": JSON.stringify(plugin.data[CONFIG])
            }
        }
    );

}

function queuePopAll(queue: IndexQueue, data: string) {

    if (queue.getFront()?.depth == undefined) {
        return "";
    }

    let item: IndexQueueNode;

    let num = 0;
    let temp = 0;
    let times = 0;
    let depth = queue.getFront().depth;
    if (depth == 1 && settings.get("col") != 1) {
        data += "{{{col\n";
        temp = Math.trunc(queue.getSize() / settings.get("col"));
        times = settings.get("col") - 1;
    }

    while (!queue.isEmpty()) {
        num++;
        item = queue.pop();
        data += item.text;
        console.log(item.text);

        if (!item.children.isEmpty()) {
            data = queuePopAll(item.children, data);
        }
        if (item.depth == 1 && num == temp && times > 0) {
            data += `\n{: id}\n`;
            num = 0;
            times--;
        }
    }
    if (depth == 1 && settings.get("col") != 1) {
        data += "}}}";
    }
    return data;
}