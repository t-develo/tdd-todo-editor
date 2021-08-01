<template>
    <div>
        {{ count }}
        <button @click="increment()">increment</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0,
        };
    },
    methods: {
        increment: function () {
            this.count++;
        },
    },
};
</script>
