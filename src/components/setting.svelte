<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { settings } from "../settings";
    import SettingItem from "./setting-item.svelte";
    import TemplateIndexTab from "./template-index-tab.svelte";
    import TemplateNone from "./template-none.svelte";
    import { i18n, plugin } from "../utils";
    // import { getDocid } from "../createIndex";
    import { eventBus } from "../enventbus";

    // export let onSubOutlineButton = function () {};
    // export let onDocOutlineButton = function () {};
    export let onCreateTemplateButton;
    export let onGetIndexTemplate;
    // export let onGetOutlineTemplate;

    // let outlineLable: any;

    let templateIndexTab: any;
    let templateoutlineTab: any;

    // let parentId = getDocid();
    // let disabled = null;
    // if (parentId == null) {
    //     disabled = "disabled";
    //     outlineLable = i18n.noneId;
    // } else {
    //     outlineLable = i18n.hadId;
    // }

    let sicon = settings.get("icon");
    let sdepth = settings.get("depth");
    let slistType = settings.get("listType");
    let slinkType = settings.get("linkType");
    let sdocBuilder = settings.get("docBuilder");
    let scol = settings.get("col");
    let sfold = settings.get("fold");
    let sautoUpdate = settings.get("autoUpdate");
    let sat = settings.get("at");
    let soutlineType = settings.get("outlineType");
    let soutlineAutoUpdate = settings.get("outlineAutoUpdate");
    let slistTypeOutline = settings.get("listTypeOutline");

    let icon = sicon == undefined ? true : sicon;
    let depth = sdepth == undefined ? 0 : sdepth;
    let listType = slistType == undefined ? "unordered" : slistType;
    let linkType = slinkType == undefined ? "ref" : slinkType;
    let docBuilder = sdocBuilder == undefined ? false : sdocBuilder;
    let col = scol == undefined ? 1 : scol;
    let fold = sfold == undefined ? 0 : sfold;
    let autoUpdate = sicon == undefined ? true : sautoUpdate;
    let at = sat == undefined ? true : sat;
    let outlineType = soutlineType == undefined ? "ref" : soutlineType;
    let outlineAutoUpdate = soutlineAutoUpdate == undefined ? false : soutlineAutoUpdate;
    let listTypeOutline = slistTypeOutline == undefined ? "unordered" : slistType;

    let tabbarfocus = "normal";
    let normalfocus = "indexSettings";
    let templatefocus = "indexTemplate";

    async function updateSettings() {
        await settings.load();
        icon = settings.get("icon");
        depth = settings.get("depth");
        listType = settings.get("listType");
        linkType = settings.get("linkType");
        //       autoUpdate = settings.get("autoUpdate");
        col = settings.get("col");
        fold = settings.get("fold");
    }
    eventBus.on("updateSettings", updateSettings);

    function addTemplateIndex(name: string) {
        let tn = document.getElementById("templateIndexnone");
        if (tn) {
            tn.remove();
        }
        let element = document.createElement("div");
        new TemplateIndexTab({
            target: element,
            props: {
                name: name,
            },
        });
        templateIndexTab.appendChild(element);
    }

    eventBus.on("addTemplateIndex", addTemplateIndex);

    function switchTab(tab: string, top: string) {
        tabbarfocus = tab;
        normalfocus = top;
    }

    eventBus.on("switchTab", switchTab);

    function addTemplateIndexNone() {
        console.log(templateIndexTab.children.length);
        if (templateIndexTab.children.length == 0) {
            let element = document.createElement("div");
            element.id = "templateIndexnone";
            new TemplateNone({
                target: element,
                props: {
                    tab: "indexSettings",
                },
            });
            templateIndexTab.appendChild(element);
        }
    }

    function addTemplateOutlineNone() {
        console.log(templateoutlineTab.children.length);
        if (templateoutlineTab.children.length == 0) {
            let element = document.createElement("div");
            element.id = "templateoutlinenone";
            new TemplateNone({
                target: element,
                props: {
                    tab: "outlineSettings",
                },
            });
            templateoutlineTab.appendChild(element);
        }
    }

    eventBus.on("addTemplateIndexNone", addTemplateIndexNone);
    eventBus.on("addTemplateOutlineNone", addTemplateOutlineNone);

    onMount(() => {
        eventBus.emit("addTemplateIndexNone");
        eventBus.emit("addTemplateOutlineNone");
    });

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
            class={tabbarfocus === "normal"
                ? "b3-list-item--focus b3-list-item"
                : "b3-list-item"}
            on:click={() => {
                tabbarfocus = "normal";
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
        <!-- <li
            data-name="outline"
            class={tabbarfocus === "outline"
                ? "b3-list-item--focus b3-list-item"
                : "b3-list-item"}
            on:click={() => {
                tabbarfocus = "outline";
                eventBus.emit("updateSettings");
            }}
        >
            <svg class="b3-list-item__graphic"
                ><use xlink:href="#iconAlignCenter" /></svg
            >
            <span class="b3-list-item__text">{i18n.outlineSettings}</span>
        </li> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
            data-name="template"
            class={tabbarfocus === "template"
                ? "b3-list-item--focus b3-list-item"
                : "b3-list-item"}
            on:click={() => {
                tabbarfocus = "template";
                onGetIndexTemplate();
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
            class={tabbarfocus === "extra"
                ? "b3-list-item--focus b3-list-item"
                : "b3-list-item"}
            on:click={() => (tabbarfocus = "extra")}
        >
            <svg class="b3-list-item__graphic"
                ><use xlink:href="#iconSQL" /></svg
            >
            <span class="b3-list-item__text">{i18n.extraSettings}</span>
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- <li
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
        </li> -->
    </ul>
    <div class="config__tab-wrap">
        <div
            data-name="normal"
            class={tabbarfocus === "normal"
                ? "config__tab-container"
                : "config__tab-container fn__none"}
        >
            <div class="fn__flex-column" style="height: 100%">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="layout-tab-bar fn__flex">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        data-name="indexSettings"
                        class={normalfocus === "indexSettings"
                            ? "item item--full item--focus"
                            : "item item--full"}
                        on:click={() => {
                            normalfocus = "indexSettings";
                            // onGetIndexTemplate();
                        }}
                    >
                        <span class="fn__flex-1" />
                        <span class="item__text">{i18n.indexSettings}</span>
                        <span class="fn__flex-1" />
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        data-name="outlineSettings"
                        class={normalfocus === "outlineSettings"
                            ? "item item--full item--focus"
                            : "item item--full"}
                        on:click={() => {
                            normalfocus = "outlineSettings";
                            // onGetTemplate();
                        }}
                    >
                        <span class="fn__flex-1" />
                        <span class="item__text">{i18n.outlineSettings}</span>
                        <span class="fn__flex-1" />
                    </div>
                </div>
                <div class="fn__flex-1">
                    <div
                        data-name="indexSettings"
                        class={normalfocus === "indexSettings"
                            ? "config__tab-container"
                            : "config__tab-container fn__none"}
                    >
                        <!-- bind:this={templateTab} -->
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
                        data-name="outlineSettings"
                        class={normalfocus === "outlineSettings"
                            ? "config__tab-container"
                            : "config__tab-container fn__none"}
                    >
                        <SettingItem
                            type="select"
                            content={i18n.settingsTab.items.listTypeOutline}
                            settingKey="listType"
                            settingValue={listTypeOutline}
                        />
                        <SettingItem
                            type="switch"
                            content={i18n.settingsTab.items.at}
                            settingKey="at"
                            settingValue={at}
                        />
                        <SettingItem
                            type="select"
                            content={i18n.settingsTab.items.outlineType}
                            settingKey="outlineType"
                            settingValue={outlineType}
                        />
                        <SettingItem
                            type="switch"
                            content={i18n.settingsTab.items.outlineAutoUpdate}
                            settingKey="outlineAutoUpdate"
                            settingValue={outlineAutoUpdate}
                        />
                        <!-- <label
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
                        </label> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- <div
            data-name="outline"
            class={tabbarfocus === "outline"
                ? "config__tab-container"
                : "config__tab-container fn__none"}
        >
            <SettingItem
                type="switch"
                content={i18n.settingsTab.items.at}
                settingKey="at"
                settingValue={at}
            />
            <SettingItem
                type="select"
                content={i18n.settingsTab.items.outlineType}
                settingKey="outlineType"
                settingValue={outlineType}
            />
            <SettingItem
                type="switch"
                content={i18n.settingsTab.items.outlineAutoUpdate}
                settingKey="outlineAutoUpdate"
                settingValue={outlineAutoUpdate}
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
        </div> -->
        <div
            data-name="template"
            class={tabbarfocus === "template"
                ? "config__tab-container"
                : "config__tab-container fn__none"}
        >
            <!-- bind:this={templateTab} -->
            <div class="fn__flex-column" style="height: 100%">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="layout-tab-bar fn__flex">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        data-name="indexTemplate"
                        class={templatefocus === "indexTemplate"
                            ? "item item--full item--focus"
                            : "item item--full"}
                        on:click={() => {
                            templatefocus = "indexTemplate";
                            // onGetIndexTemplate();
                        }}
                    >
                        <span class="fn__flex-1" />
                        <span class="item__text">目录模板</span>
                        <span class="fn__flex-1" />
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        data-name="outlineTemplate"
                        class={templatefocus === "outlineTemplate"
                            ? "item item--full item--focus"
                            : "item item--full"}
                        on:click={() => {
                            templatefocus = "outlineTemplate";
                            // onGetTemplate();
                        }}
                    >
                        <span class="fn__flex-1" />
                        <span class="item__text">大纲模板</span>
                        <span class="fn__flex-1" />
                    </div>
                </div>
                <div class="fn__flex-1">
                    <div
                        data-name="indexTemplate"
                        class={templatefocus === "indexTemplate"
                            ? "config__tab-container"
                            : "config__tab-container fn__none"}
                        bind:this={templateIndexTab}
                    >
                        {#each Object.entries(plugin.data) as [key]}
                            {#if key != "config" && key.indexOf("index") != -1}
                                <div>
                                    <TemplateIndexTab name={key} />
                                </div>
                            {/if}
                        {/each}
                    </div>
                    <div
                        data-name="outlineTemplate"
                        class={templatefocus === "outlineTemplate"
                            ? "config__tab-container"
                            : "config__tab-container fn__none"}
                        bind:this={templateoutlineTab}
                    >
                        {#each Object.entries(plugin.data) as [key]}
                            {#if key != "config" && key.indexOf("outline") != -1}
                                <div>
                                    <!-- <TemplateTab name={key} /> -->
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <!-- {#each Object.entries(plugin.data) as [key]}
                {#if key != "config"}
                    <div>
                        <TemplateTab name={key} />
                    </div>
                {/if}
            {/each} -->
        </div>
        <div
            data-name="extra"
            class={tabbarfocus === "extra"
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
        <!-- <div
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
        </div> -->
    </div>
</div>
