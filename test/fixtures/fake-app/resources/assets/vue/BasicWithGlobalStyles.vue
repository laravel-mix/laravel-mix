<template>
    <div class="hello">{{ message }}</div>
</template>

<script>
module.exports = {
    data: () => ({
        message: 'Hello World'
    })
};
</script>

<style lang="css">
.shared-css {
    color: var(--shared-color);
}
</style>

<style lang="scss">
.shared-scss {
    color: $sharedColor;
}
</style>

<style lang="sass">
.shared-sass
    color: $sharedColor
</style>

<style lang="less">
.shared-less {
    color: @sharedColor;
}
</style>

<style lang="stylus">
.shared-stylus
    color sharedColor
</style>
