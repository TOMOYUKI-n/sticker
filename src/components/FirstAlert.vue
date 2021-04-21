<template>
    <v-alert
        v-model="alert"
        border="left"
        colored-border
        type="info"
        elevation="2"
        class="p-alert p-alert__info"
        close-text="Close Alert"
        dismissible
        dark
    >
        付箋を追加して、タスク管理をしましょう。
    </v-alert>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({ components: {} })
export default class FirstAlert extends Vue {
    private alert = true;
}
</script>

<style lang="scss" scoped>
.p-alert {
    height: 97px;
    padding: 20px;
    margin: 0px 10px 0px auto;
    font-size: 16px;
    opacity: 0.9;
    &__info {
        top: 70px;
        width: 30%;
    }
}
@media screen and (max-width: 1264px) {
    .p-alert {
        width: 100%;
        min-height: 64px;
        height: 97px;
        padding: 20px;
        margin: 0px 10px 0px auto;
        font-size: 14px;
        opacity: 0.9;
        &__info {
            top: 70px;
        }
    }
}
</style>
