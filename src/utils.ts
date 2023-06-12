import { getFrontend } from "siyuan";
import IndexPlugin from ".";

export function sleep (time:number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export let i18n: any;
export function setI18n(_i18n: any) {
    i18n = _i18n;
}

export let plugin: IndexPlugin;
export function setPlugin(_plugin: any) {
    plugin = _plugin;
}

// export const escapeHtml = (unsafe) => {
//     return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
// }

export const escapeHtml = (unsafe:any) => {
    return unsafe.replaceAll('[', '\\[').replaceAll(']', '\\]');
}


const frontEnd = getFrontend();
export const isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";