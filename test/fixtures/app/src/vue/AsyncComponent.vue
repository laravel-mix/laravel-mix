<template>
    <div class="hello">{{ message }}</div>
</template>

<script>
module.exports = {
    data() {
        return {
            message: 'Async A'
        };
    }
};
</script>

<style scoped>
.hello {
    color: green;
}
</style>
