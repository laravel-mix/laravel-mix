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

<style lang="sass">
$primary: black

.hello
    color: $primary
</style>
