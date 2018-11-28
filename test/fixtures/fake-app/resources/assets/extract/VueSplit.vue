<template>
    <div>
        <div class="hello">{{ message }}</div>
        <pure-split></pure-split>
    </div>
</template>

<script>
module.exports = {
    components: {
        PureSplit: () =>
            import(/* webpackChunkName: 'js/split' */ './PureSplit.js')
    },

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
}
</style>
