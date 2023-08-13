import { Dialog, fetchSyncPost, showMessage } from "siyuan";
import { i18n, plugin } from "./utils";
import TemplateDialog from "./components/template-dialog.svelte"
import { settings } from "./settings";
import { eventBus } from "./enventbus";

/**
 * 点击创建配置模板
 * @returns void
 */
export async function onCreateTemplateButton() {
    getNameDialog();
    console.log("create template");

}

function getNameDialog(){
    const settingsDialog = "index-get-template-name";

    const dialog = new Dialog({
        title: i18n.settingsTab.items.templateDialog.title,
        content: `<div id="${settingsDialog}" class="b3-dialog__content">`,
        width:"300px",
    });
    let templateDialog: TemplateDialog;
    let div: HTMLDivElement = dialog.element.querySelector(`#${settingsDialog}`);

    templateDialog = new TemplateDialog({
        target: div,
        props:{
            onSave: ()=>{onSave(dialog)}
        }
    });
}

async function onSave(dialog:Dialog){

    let el: HTMLInputElement = dialog.element.querySelector("#template-name");
    if(el.value == ""){
        showMessage(
            i18n.templateNameEepty,
            3000,
            "error"
        );
        return;
    } else {
        let rs = await fetchSyncPost(
            "/api/file/readDir",
            {
                "path": "/data/storage/petal/siyuan-plugins-index"
            }
        );
        let data = rs.data;

        for (const iterator of data) {
            console.log(iterator.name);
            if(iterator.name.indexOf("template-"+el.value) != -1){
                showMessage(
                    i18n.templateAgain,
                    3000,
                    "error"
                );
                return;
            }
        }
        await settings.saveCopy("template-"+el.value);
        eventBus.emit("addTemplate","template-"+el.value);
        
    }
    console.log("el:"+el.value);
    dialog.destroy();
    showMessage(
        i18n.templateCreated,
        3000,
        "info"
    );
}

export async function onGetTemplate(){
    let rs = await fetchSyncPost(
        "/api/file/readDir",
        {
            "path": "/data/storage/petal/siyuan-plugins-index"
        }
    );

    let data = rs.data;

    for (const iterator of data) {
        if(iterator.name.startsWith("template-")){
            await settings.load(iterator.name);
        }
    }

    for (const key in plugin.data) {
        console.log(key);
    }
    
}