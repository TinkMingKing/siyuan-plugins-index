import { getFrontend } from "siyuan";
import IndexPlugin from ".";

/**
 * 延迟函数
 * @param time 时间
 * @returns 返回后需await
 */
export function sleep (time:number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//i18n全局实例
export let i18n: any;
export function setI18n(_i18n: any) {
    i18n = _i18n;
}

//插件全局对象
export let plugin: IndexPlugin;
export function setPlugin(_plugin: any) {
    plugin = _plugin;
}

/**
 * 替换字符串中的`[]`字符
 * @param unsafe 待处理字符串
 * @returns 处理后的字符串
 */
export function escapeHtml(unsafe:any){
    return unsafe.replaceAll('[', '\\[').replaceAll(']', '\\]').replaceAll('\'', '&apos;');
}

/**
 * 检测是否包含emoji
 * @param text 待检测文本
 * @returns 检测结果
 */
export function hasEmoji(text:string){
    const emojiRegex = /\p{Emoji}/u;
    // const customemojiRegex = /:.*:/;
    // return emojiRegex.test(text) && customemojiRegex.test(text);
    return emojiRegex.test(text);
}

//运行环境检测
const frontEnd = getFrontend();
export const isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";