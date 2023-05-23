<script>
    import { settings } from "../settings";

    // import { eventBus } from "../event-bus";
    export let type; // 设置项目类型
    export let content; // 设置项目内部文本展示
    export let settingKey; // 设置项目 key
    export let settingValue; // 设置项目初始值

    function updateSetting() {
        settings.set(settingKey,settingValue);
        settings.save();
        // console.log("settingKey="+settingKey,"settingValue="+settingValue);
        // eventBus.publish(eventBus.EventSetting, {
        //     key: settingKey,
        //     value: settingValue,
        // });
    }
</script>

<label class="fn__flex b3-label config__item">
    <div class="fn__flex-1">
        {content.title}
        <div class="b3-label__text">
            {@html content.content}
        </div>
    </div>
    <span class="fn__space" />
    {#if type === "range"}
        <div class="b3-tooltips b3-tooltips__n fn__flex-center" aria-label={settingValue}>
            <input
                class="b3-slider fn__size200"
                id={settingKey}
                type="range"
                min={content.min}
                max={content.max}
                step={content.step}
                bind:value={settingValue}
                on:change={updateSetting}
            />
        </div>
    {:else if type === "switch"}
        <input
            class="b3-switch fn__flex-center"
            id={settingKey}
            type="checkbox"
            bind:checked={settingValue}
            on:change={updateSetting}
        />
    {/if}
</label>