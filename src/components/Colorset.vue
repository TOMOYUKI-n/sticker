<template>
    <v-menu bottom origin="center center" transition="scale-transition">
        <template v-slot:activator="{ on }">
            <v-btn
                elevation="0"
                :color="value"
                class=""
                v-bind:class="{ example: xNum === 1 }"
                :style="{
                    minWidth: buttonWidth + 'px',
                    maxWidth: buttonWidth + 'px',
                    width: buttonWidth + 'px',
                    height: buttonWidth + 'px',
                    padding: 0 + 'px',
                    filter: 'brightness(0.92)'
                }"
                v-on="on"
            ></v-btn>
        </template>

        <v-item-group mandatory :value="value" style="overflow: hidden;">
            <v-card :style="{ background: backgroundColor }">
                <div
                    class="d-flex flex-wrap"
                    :style="{
                        width:
                            (
                                (itemSize + margin) * column +
                                margin * 2
                            ).toString() + 'px',
                        padding: margin + 'px'
                    }"
                >
                    <v-item
                        v-for="(c, key) in colors"
                        :key="key"
                    >
                        <div
                            v-ripple
                            class="palette"
                            :class="value === c ? 'active' : ''"
                            @click.prevent="$emit('input', c)"
                            :style="{
                                background: c,
                                height: itemSize + 'px',
                                width: itemSize + 'px'
                            }"
                            style="margin:1px;"
                        ></div>
                    </v-item>
                </div>
            </v-card>
        </v-item-group>
    </v-menu>
</template>
<script lang="ts">
/**
 * @packageDocumentation
 * @module Components
 * @preferred
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import { VMenu, VItemGroup, VCard, VItem, VBtn } from "vuetify/lib";
const defaultColors = ["#ff595e", "#ffca3a", "#8ac926", "#78CDEA", "#ff99c8", "#bdb2ff", "#FF5722", "#8D6E63", "#78909C", "#B388FF"];
/**
 * カラーパレットだよ
 */
@Component({ components: { VMenu, VItemGroup, VCard, VItem, VBtn } })
export default class ColorPalette extends Vue {
    /**
     * 選択させる色一覧
     */
    @Prop({ default: () => 24 }) buttonWidth!: number;
    /**
     * 選択させる色一覧
     */
    @Prop({ default: () => defaultColors }) colors!: string[];
    /**
     * 初期値
     */
    @Prop({ default: defaultColors[0] }) value!: string;
    /**
     * ボタンの大きさ
     */
    @Prop({ default: 32 }) readonly itemSize!: number;
    /**
     * 折り返すまでの数
     */
    @Prop({ default: 5 }) readonly column!: number;
    /**
     * ボタン同士の隙間の大きさ
     */
    @Prop({ default: 2 }) readonly margin!: number;
    /**
     * パレットの背景色
     */
    @Prop({ default: "#4b4b4b" }) readonly backgroundColor!: string;
    /**
     * コンポーネントが生成されたときに実行されます．
     */
    private created() {
        if (this.value) {
            this.$emit("input", this.value);
            this.$forceUpdate();
        } else {
            this.$emit("input", this.colors[0]);
            this.$forceUpdate();
        }
    }

    public xNum = Math.floor(Math.random() * 100) % 30;
}
</script>
<style scoped>
.active::after {
    background: #00000049 !important;
    z-index: 333;
    width: 48px;
    height: 48px;
    padding: 0;
    font-size: 24px;
    padding: 6px 8px 6px 4px;
    color: #00000049;
    content: "●";
    overflow: hidden;
}
.palette:hover {
    filter: brightness(90%);
}
.example {
    /* 背景グラデーションを指定・幅を 200% にしておく */
    background: linear-gradient(
            to right,
            #f00 0%,
            #f80 14.28%,
            #dd0 28.56%,
            #0d0 42.85%,
            #0dd 57.14%,
            #00f 71.42%,
            #e0e 85.71%,
            #f00 100%
        )
        0% center / 200% auto;
    /* アニメーション指定 */
    animation: example 4s linear infinite;
}

/* 背景の横位置をズラす */
@keyframes example {
    to {
        background-position-x: 200%;
    }
}
</style>
