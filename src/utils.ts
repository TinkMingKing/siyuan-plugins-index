import IndexPlugin from ".";

export function log(data: any){
    console.log(data);
}

export let i18n: any;
export function setI18n(_i18n: any) {
    i18n = _i18n;
}

export let plugin: IndexPlugin;
export function setPlugin(_plugin: any) {
    plugin = _plugin;
}