<template>
    <div class="hello">{{ message }}</div>
</template>

<script>
module.exports = {
    data() {
        return {
            message: 'Hello World'
        };
    }
};
</script>

<style>
:root {
    --color: white;
}

.hello {
    color: var(--color);
}
</style>
