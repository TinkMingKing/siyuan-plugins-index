<script>
    import { beforeUpdate, onDestroy } from "svelte";
    import { settings } from "../settings";
    import SettingItem from "./setting-item.svelte";
    import { i18n } from "../utils";
    import { getDocid } from "../createIndex";

    beforeUpdate(async () => {
        await settings.load();
    });

    export let onSubOutlineButton = function () {};
    export let onDocOutlineButton = function () {};

    let outlineLable;

    let parentId = getDocid();
    let disabled = null;
    if (parentId == null) {
        disabled = "disabled";
        outlineLable = i18n.noneId;
    } else {
        outlineLable = i18n.hadId;
    }

    let sicon = settings.get("icon");
    let sdepth = settings.get("depth");
    let slistType = settings.get("listType");
    let slinkType = settings.get("linkType");
    let sdocBuilder = settings.get("docBuilder");
    let sautoUpdate = settings.get("autoUpdate");
    let icon = sicon == undefined ? true : sicon;
    let autoUpdate = sicon == undefined ? true : sautoUpdate;
    let depth = sdepth == undefined ? 0 : sdepth;
    let listType = slistType == undefined ? "unordered" : slistType;
    let linkType = slinkType == undefined ? "ref" : slinkType;
    let docBuilder = sdocBuilder == undefined ? false : sdocBuilder;

    onDestroy(() => {
        settings.save();
    });
</script>

<div class="b3-dialog__content">
    <div class="config__tab-container">
        <SettingItem
            type="select"
            content={i18n.settingsTab.items.listType}
            settingKey="listType"
            settingValue={listType}
        />
        <SettingItem
            type="select"
            content={i18n.settingsTab.items.linkType}
            settingKey="linkType"
            settingValue={linkType}
        />
        <SettingItem
            type="switch"
            content={i18n.settingsTab.items.icon}
            settingKey="icon"
            settingValue={icon}
        />
        <SettingItem
            type="switch"
            content={i18n.settingsTab.items.autoUpdate}
            settingKey="autoUpdate"
            settingValue={autoUpdate}
        />
        <SettingItem
            type="range"
            content={i18n.settingsTab.items.depth}
            settingKey="depth"
            settingValue={depth}
        />
        <SettingItem
            type="switch"
            content={i18n.settingsTab.items.docBuilder}
            settingKey="docBuilder"
            settingValue={docBuilder}
        />
        <div class="b3-label">
            <div class="b3-label b3-label--inner">
                {@html outlineLable}
            </div>
        </div>
        <SettingItem
            type="button"
            content={i18n.settingsTab.items.subOutlineButton}
            settingKey="subOutlineButton"
            settingValue=""
            onMyClick={onSubOutlineButton}
            {disabled}
        />
        <SettingItem
            type="button"
            content={i18n.settingsTab.items.docOutlineButton}
            settingKey="docOutlineButton"
            settingValue=""
            onMyClick={onDocOutlineButton}
            {disabled}
        />
    </div>
</div>
