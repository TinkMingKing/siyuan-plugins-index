<script>
    import { eventBus } from "../enventbus";
    import { i18n } from "../utils";
</script>

<div class="b3-label">
    <div class="b3-label b3-label--inner">
        {i18n.nothasTemplate}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
            on:click={() => {
                eventBus.emit("switchTab", "normal");
                console.log("switchTab");
            }}
        >
            {i18n.cliketoAdd}
        </a>
    </div>
</div>
