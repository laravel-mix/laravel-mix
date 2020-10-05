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

<style lang="less">
@color: blue;

.hello {
    color: @color;
}
</style>
