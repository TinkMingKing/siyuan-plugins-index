import { IObject, fetchSyncPost, isMobile, showMessage } from 'siyuan';

const STORAGE_MENU = "menu-config-icon";

export async function main(i18n: IObject, sdata: any) {
    let parentId = getDocid();
    if (parentId == null) {
        showMessage(
            i18n.errorMsg_empty,
            3000,
            "error"
        );
        return;
    }
    let [box, path] = await getParentDoc(parentId);
    let data = '';
    data = await createIndex(box, path, data, sdata);
    if (data != '') {
        insertData(parentId, data);
        showMessage(
            i18n.msg_success,
            3000,
            "info"
        );
    } else
        showMessage(
            i18n.errorMsg_miss,
            3000,
            "error"
        );
}

//获取当前文档信息
async function getParentDoc(parentId: string) {

    let response = await fetchSyncPost(
        "/api/query/sql",
        {
            stmt: `SELECT * FROM blocks WHERE id = '${parentId}'`
        }
    );
    let result = response.data;
    //返回值为数组
    let box = result[0].box;
    let path = result[0].path;
    return [box, path];
}

//获取当前文档id
function getDocid() {
    if (isMobile())
        return document.querySelector('#editor .protyle-content .protyle-background')?.getAttribute("data-node-id");
    else
        return document.querySelector('.layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background')?.getAttribute("data-node-id");
}

async function requestSubdoc(notebook: any, path: any) {
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
async function createIndex(notebook: any, ppath: any, data: string, sdata: any, tab = 0) {

    let docs = await requestSubdoc(notebook, ppath);
    tab++;
    //生成写入文本
    for (let doc of docs) {

        let id = doc.id;
        let name = doc.name.slice(0, -3);
        let icon = doc.icon;
        let subFileCount = doc.subFileCount;
        let path = doc.path;
        for (let n = 0; n < tab; n++)
            data += '  ';
        if (sdata[STORAGE_MENU] == "true") {
            data += `* ${getSubdocIcon(icon, subFileCount != 0)}[${name}](siyuan://blocks/${id})\n`;
        } else if (sdata[STORAGE_MENU] == "false") {
            data += `* [${name}](siyuan://blocks/${id})\n`;
        }


        if (subFileCount > 0) {//获取下一层级子文档
            data = await createIndex(notebook, path, data, sdata, tab);
        }

    }
    return data;
}

async function insertData(id: string, data: string) {
    await fetchSyncPost(
        "/api/block/prependBlock",
        {
            data: data,
            dataType: "markdown",
            parentID: id
        }
    );
}