<script>
    import { createEventDispatcher } from "svelte";
    // import { eventBus } from "../event-bus";
    export let type; // 设置项目类型
    export let content; // 设置项目内部文本展示
    export let settingKey; // 设置项目 key
    export let settingValue; // 设置项目初始值

    const dispatch = createEventDispatcher();

    function onClick() {
        dispatch("click");
    }

    function updateSetting() {
        // eventBus.publish(eventBus.EventSetting, {
        //     key: settingKey,
        //     value: settingValue,
        // });
    }
</script>

<label class="fn__flex b3-label">
    <div class="fn__flex-1">
        {content.title}
        <div class="b3-label__text">
            {content.text}
        </div>
    </div>
    <span class="fn__space" />
    <!-- <slot /> -->
    {#if type === "checkbox"}
        <!-- Checkbox -->
        <input
            class="b3-switch fn__flex-center"
            id={settingKey}
            type="checkbox"
            bind:checked={settingValue}
            on:change={updateSetting}
        />
    {:else if type === "input"}
        <!-- 文本输入框 -->
        <input
            class="b3-text-field fn__flex-center fn__size200"
            id={settingKey}
            placeholder={content.placeholder}
            bind:value={settingValue}
            on:change={updateSetting}
        />
    {:else if type === "button"}
        <!-- 按钮 -->
        <button
            class="b3-button b3-button--outline fn__flex-center fn__size200"
            id={settingKey}
            on:click={onClick}
        >
            {content.button}
        </button>
    {:else if type === "select"}
        <!-- 下拉选项 -->
        <select
            class="b3-select fn__flex-center fn__size200"
            id="iconPosition"
            bind:value={settingValue}
            on:change={updateSetting}
        >
            {#each Object.entries(content.options) as [key, text]}
                <option value={key}>{text}</option>
            {/each}
        </select>
    {:else if type === "range"}
        <input
            class="b3-slider fn__size200"
            id={settingKey}
            type="range"
            placeholder={content.placeholder}
            bind:value={settingValue}
            on:change={updateSetting}
        />
    {:else if type === "switch"}
        <input
            class="b3-switch fn__flex-center"
            id={settingKey}
            type="checkbox"
            placeholder={content.placeholder}
            bind:value={settingValue}
            on:change={updateSetting}
        />
    {/if}
</label>
