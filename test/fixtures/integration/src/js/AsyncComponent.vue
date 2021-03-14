<style>
.async-style {
    color: #ff7700;
}
</style>
<style scoped>
.async-style-scoped {
    border: 1px solid #ff7700;
}
</style>

<template>
    <div id="async-component" class="async-style async-style-scoped">
        This will have an orange border and orange text.
    </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
    setup() {
        onMounted(() => {
            const style = window.getComputedStyle(
                document.querySelector('#async-component')
            );

            console.log(`async component style: ${style.color} ${style.borderColor}`);
        });
    }
};
</script>
