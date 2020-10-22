<style lang="scss" module>
.wrapper {
    border: 1px solid #ff7700;
}
</style>

<template>
    <div id="scss-module" :class="$style.wrapper">This will have an orange border.</div>
</template>

<script>
import { onMounted, useCssModule } from 'vue';

export default {
    setup() {
        useCssModule();

        onMounted(() => {
            const style = window.getComputedStyle(document.querySelector('#scss-module'));

            console.log(`style: ${style.borderColor}`);
        });
    }
};
</script>
