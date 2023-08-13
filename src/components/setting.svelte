<script lang="ts">
    import { onDestroy } from "svelte";
    import { settings } from "../settings";
    import SettingItem from "./setting-item.svelte";
    import TemplateTab from "./template-tab.svelte";
    import { i18n, plugin } from "../utils";
    import { getDocid } from "../createIndex";
    import { eventBus } from "../enventbus";

    export let onSubOutlineButton = function () {};
    export let onDocOutlineButton = function () {};
    export let onCreateTemplateButton = function () {};
    export let onGetTemplate = function () {};

    let outlineLable;

    let templateTab;

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
    let scol = settings.get("col");
    let sfold = settings.get("fold");
    let sautoUpdate = settings.get("autoUpdate");

    let icon = sicon == undefined ? true : sicon;
    let depth = sdepth == undefined ? 0 : sdepth;
    let listType = slistType == undefined ? "unordered" : slistType;
    let linkType = slinkType == undefined ? "ref" : slinkType;
    let docBuilder = sdocBuilder == undefined ? false : sdocBuilder;
    let col = scol == undefined ? 1 : scol;
    let fold = sfold == undefined ? 0 : sfold;
    let autoUpdate = sicon == undefined ? true : sautoUpdate;

    let focus = "normal";

    async function updateSettings() {
        await settings.load();
        icon = settings.get("icon");
        depth = settings.get("depth");
        listType = settings.get("listType");
        linkType = settings.get("linkType");
        autoUpdate = settings.get("autoUpdate");
        col = settings.get("col");
        fold = settings.get("fold");
    }
    eventBus.on("updateSettings", updateSettings);

    function callback(name: string) {
        let element = document.createElement("div");
        new TemplateTab({
            target: element,
            props: {
                name: name,
            },
        });
        templateTab.appendChild(element);
    }
    eventBus.on("addTemplate", callback);

    onDestroy(() => {
        settings.save();
    });
</script>

<div class="fn__flex-1 fn__flex config__panel">
    <ul class="b3-tab-bar b3-list b3-list--background">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
            data-name="normal"
            class={focus === "normal"
                ? "b3-list-item--focus b3-list-item"
                : "b3-list-item"}
            on:click={() => {
                focus = "normal";
                eventBus.emit("updateSettings");
            }}
        >
            <svg class="b3-list-item__graphic"
                ><use xlink:href="#iconSettings" /></svg
            >
            <span class="b3-list-item__text">{i18n.generalSettings}</span>
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
            data-name="template"
            class={focus === "template"
                ? "b3-list-item--focus b3-list-item"
                : "b3-list-item"}
            on:click={() => {
                focus = "template";
                onGetTemplate();
            }}
        >
            <svg class="b3-list-item__graphic"
                ><use xlink:href="#iconBazaar" /></svg
            >
            <span class="b3-list-item__text">{i18n.templateSettings}</span>
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
            data-name="extra"
            class={focus === "extra"
                ? "b3-list-item--focus b3-list-item"
                : "b3-list-item"}
            on:click={() => (focus = "extra")}
        >
            <svg class="b3-list-item__graphic"
                ><use xlink:href="#iconList" /></svg
            >
            <span class="b3-list-item__text">{i18n.extraSettings}</span>
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
            data-name="individual"
            class={focus === "individual"
                ? "b3-list-item--focus b3-list-item"
                : "b3-list-item"}
            on:click={() => (focus = "individual")}
        >
            <svg class="b3-list-item__graphic"
                ><use xlink:href="#iconEdit" /></svg
            >
            <span class="b3-list-item__text">{i18n.independentInsert}</span>
        </li>
    </ul>
    <div class="config__tab-wrap">
        <div
            data-name="normal"
            class={focus === "normal"
                ? "config__tab-container"
                : "config__tab-container fn__none"}
        >
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
                type="range"
                content={i18n.settingsTab.items.depth}
                settingKey="depth"
                settingValue={depth}
            />
            <SettingItem
                type="range"
                content={i18n.settingsTab.items.fold}
                settingKey="fold"
                settingValue={fold}
            />
            <SettingItem
                type="range"
                content={i18n.settingsTab.items.col}
                settingKey="col"
                settingValue={col}
            />
            <SettingItem
                type="switch"
                content={i18n.settingsTab.items.autoUpdate}
                settingKey="autoUpdate"
                settingValue={autoUpdate}
            />
            <label
                class="fn__flex b3-label config__item"
                style="flex-direction: column;"
            >
                <div class="fn__flex">
                    <div class="fn__flex-1" />
                    <button
                        class="b3-button b3-button--outline fn__flex-center fn__size200"
                        id="createtemplate"
                        on:click={onCreateTemplateButton}
                    >
                        <svg><use xlink:href="#iconAdd" /></svg>
                        {i18n.settingsTab.items.createTemplate}
                    </button>
                </div>
            </label>
        </div>
        <div
            data-name="template"
            class={focus === "template"
                ? "config__tab-container"
                : "config__tab-container fn__none"}
            bind:this={templateTab}
        >
            {#each Object.entries(plugin.data) as [key]}
                {#if key != "config"}
                    <TemplateTab name={key} />
                {/if}
            {/each}
        </div>
        <div
            data-name="extra"
            class={focus === "extra"
                ? "config__tab-container"
                : "config__tab-container fn__none"}
        >
            <SettingItem
                type="switch"
                content={i18n.settingsTab.items.docBuilder}
                settingKey="docBuilder"
                settingValue={docBuilder}
            />
        </div>
        <div
            data-name="individual"
            class={focus === "individual"
                ? "config__tab-container"
                : "config__tab-container fn__none"}
        >
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
</div>