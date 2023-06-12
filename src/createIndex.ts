import { fetchSyncPost, showMessage } from 'siyuan';
import { escapeHtml, i18n, isMobile } from './utils';
import {  settings } from './settings';

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
    data = await createIndex(box, path, data);
    if (data != '') {
        insertData(parentId, data);
    } else
        showMessage(
            i18n.errorMsg_miss,
            3000,
            "error"
        );
}

//获取当前文档信息
export async function getParentDoc(parentId: string) {

    let response = await fetchSyncPost(
        "/api/query/sql",
        {
            stmt: `SELECT * FROM blocks WHERE id = '${parentId}'`
        }
    );
    let result = response.data[0];
    console.log(response);
    //返回值为数组
    let box = result.box;
    let path = result.path;
    return [box, path];
}

//获取当前文档id
function getDocid() {
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
async function createIndex(notebook: any, ppath: any, data: string, tab = 0) {

    if (settings.get("depth") == 0 || settings.get("depth") > tab) {

        let docs = await requestSubdoc(notebook, ppath);
        tab++;

        //生成写入文本
        for (let doc of docs) {

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
            if(listType){
                data += "* ";
            } else {
                data += "1. ";
            }
            if (settings.get("icon")) {
                data += `${getSubdocIcon(icon, subFileCount != 0)} `;
            }

            //置入数据
            let linkType = settings.get("linkType") == "ref" ? true : false;
            if(linkType){
                data += `[${name}](siyuan://blocks/${id})\n`;
            } else {
                data += `((${id} '${name}'))\n`;
            }
            //`((id "锚文本"))`
            if (subFileCount > 0) {//获取下一层级子文档
                data = await createIndex(notebook, path, data, tab);
            }

        }
    }

    return data;
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
                        "custom-index-create": result.data[0].doOperations[0].id
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
                        "custom-index-create": result.data[0].doOperations[0].id
                    }
                }
            );
            showMessage(
                i18n.update_success,
                3000,
                "info"
            );
        }

        // showMessage(
        //     i18n.msg_success,
        //     3000,
        //     "info"
        // );
    } catch (error) {
        showMessage(
            i18n.dclike,
            3000,
            "error"
        );
    }


}
/**

async function insertData(id: string, data: string) {

    let rs = await fetchSyncPost(
        "/api/attr/getBlockAttrs",
        {
            id: id
        }
    );
    log(rs.data["custom-index-create"]);
    if (rs.data["custom-index-create"] == undefined) {
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
                id: id,
                attrs: {
                    "custom-index-create": result.data[0].doOperations[0].id
                }
            }
        );
    } else {
        // try {
            let result = await fetchSyncPost(
                "/api/block/updateBlock",
                {
                    data: data,
                    dataType: "markdown",
                    id: rs.data["custom-index-create"]
                }
            );
            log(result.data?.[0].doOperations[0].id);
            if(result.data?.[0].doOperations[0].id != undefined){
                await fetchSyncPost(
                    "/api/attr/setBlockAttrs",
                    {
                        id: id,
                        attrs: {
                            "custom-index-create": result.data[0].doOperations[0].id
                        }
                    }
                );
            } else {
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
                        id: id,
                        attrs: {
                            "custom-index-create": result.data[0].doOperations[0].id
                        }
                    }
                );
            }
            
        // } catch (error) {
        //     if(error.name == "TypeError"){
        //         log("TypeError");
        //     }
        // }
    }


}

 */
