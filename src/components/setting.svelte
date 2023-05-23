<script>
    import { onDestroy } from "svelte";
    import { settings } from "../settings";
    import SettingItem from "./setting-item.svelte";
    import { i18n } from "../utils";
    // import { onDestroy } from "svelte";

    // let icon = settings.get("icon");
    // let depth = settings.get("depth");
    // console.log(icon);
    // console.log(depth);
    // let checked = settings.get("OpenOnStart");
    // let notebookSort = settings.get("NotebookSort");
    // let defaultNotebook = settings.get("DefaultNotebook");
    // let iconPosition = settings.get("IconPosition");

    // const dispatch = createEventDispatcher();

    // export let contents;

    // function onClick() {
        // dispatch("updateAll");
    // }

    onDestroy(() => {
        // settings.save();
    });
</script>

<div class="config__tab-container">
    <SettingItem
        type="switch"
        content={i18n.settingsTab.items.icon}
        settingKey="icon"
        settingValue={settings.get("icon")}
    />
    <SettingItem
        type="range"
        content={i18n.settingsTab.items.depth}
        settingKey="depth"
        settingValue={settings.get("depth")}
    />
</div>