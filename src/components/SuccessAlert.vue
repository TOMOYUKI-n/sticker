<template>
    <transition name="successtrans">
        <v-alert
            v-model="alert"
            border="left"
            colored-border
            type="success"
            elevation="2"
            class="p-alert p-alert__success"
            dark
        >
            すべて削除しました
        </v-alert>
    </transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({ components: {} })
export default class SuccessAlert extends Vue {
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
    &__success {
        top: 80px;
        width: 25%;
        transition: all 2s ease-in 1.5s;
    }
}
@media screen and (max-width: 1264px) {
    .p-alert {
        width: 100%;
        height: 97px;
        padding: 20px;
        margin: 0px 10px 0px auto;
        font-size: 14px;
        opacity: 0.9;
        &__success {
            top: 80px;
        }
    }
}
</style>
