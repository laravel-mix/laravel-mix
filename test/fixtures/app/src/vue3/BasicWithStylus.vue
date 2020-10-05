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

<style lang="styl">
margin = 10px

.hello
    margin: margin
</style>
