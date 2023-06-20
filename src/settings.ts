import { plugin } from "./utils";

//配置文件名称
export const CONFIG = "config";

//配置文件内容
const DEFAULT_CONFIG = {
    icon: true,
    depth: 0,
    listType:"unordered",
    linkType:"ref",
    docBuilder: false
};

class Settings{

    //初始化配置文件
    async initData() {
        //载入配置
        await this.load();

        //配置不存在则按照默认值建立配置文件
        if (plugin.data[CONFIG] === "" || plugin.data[CONFIG] === undefined || plugin.data[CONFIG] === null) {
            await plugin.saveData(CONFIG, JSON.stringify(DEFAULT_CONFIG));
        }
        await this.load();
    }

    set(key:any, value:any){
        plugin.data[CONFIG][key] = value;
    }

    get(key:any){
        return plugin.data[CONFIG]?.[key];
    }

    async load(){
        await plugin.loadData(CONFIG);
    }

    async save(){
        await plugin.saveData(CONFIG, plugin.data[CONFIG]);
    }

    loadSettings(data: any){
        this.set("icon",data.icon);
        this.set("depth",data.depth);
        this.set("listType",data.listType);
        this.set("linkType",data.linkType);
    }

}

export const settings: Settings = new Settings();