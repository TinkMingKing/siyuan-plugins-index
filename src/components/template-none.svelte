<script>
    import { eventBus } from "../enventbus";
</script>

<div class="b3-label">
    <div class="b3-label b3-label--inner">
        当前无模版
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
            on:click={() => {
                eventBus.emit("switchTab", "normal");
                console.log("switchTab");
            }}
        >
            点击前往添加模板
        </a>
    </div>
</div>
