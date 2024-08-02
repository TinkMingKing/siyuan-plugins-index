<script lang="ts">
    import { SettingsProperty } from "../../settings";
    import { i18n } from "../../utils";
    import SettingItem from "../setting-item.svelte";

    export let tabbarfocus : any;
    export let settingsStrings : SettingsProperty;
</script>

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
    settingValue={settingsStrings.docBuilder}
/>
</div>