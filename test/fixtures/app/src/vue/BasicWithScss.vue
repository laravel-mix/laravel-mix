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

<style lang="scss">
.hello {
    color: blue;
    background: url(./does-not-exist.png);
}
</style>
