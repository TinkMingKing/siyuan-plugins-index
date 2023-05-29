<script>
    import { onDestroy } from "svelte";
    import { settings } from "../settings";
    import SettingItem from "./setting-item.svelte";
    import { i18n } from "../utils";

    let sicon = settings.get("icon");
    let sdepth = settings.get("depth");
    let icon = sicon==undefined ? true : sicon;
    let depth = sdepth==undefined ? 0 : sdepth;

    onDestroy(() => {
        settings.save();
    });
</script>

<div class="config__tab-container">
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
</div>