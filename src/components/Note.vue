<template>
    <div class="p-textarea__wrapper">
        <!--1枚のカード-->
        <div class="p-textarea__container elevation-1">
            <!-- 編集/非編集 切替エリア -->
            <div
                class="d-flex pr-1 pl-1 align-center p-card-header"
                :style="'background:' + note.color"
            >
                <v-checkbox
                    color="black"
                    dense
                    v-model="note.isChecked"
                ></v-checkbox>
                <!-- 設定エリア -->
                <input
                    class="p-btn-blank"
                    type="text"
                    v-model="note.title"
                    placeholder="タイトルを入力"
                    v-bind:class="{ Checked: note.isChecked }"
                    v-bind:readonly="isReadonly"
                />
                <ColorsetComponent v-model="note.color" />
                <v-btn
                    class="text-center p-btn-menu elevation-0 "
                    color="transparent"
                    @click="temporaryDeletion()"
                    offset
                >
                    <v-icon x-small>mdi-trash-can-outline</v-icon>
                </v-btn>
                <v-btn
                    class="p-btn-menu p-btn-menu__moves px-2 elevation-0"
                    color="transparent"
                    @click="test"
                >
                    <v-icon small>mdi-drag</v-icon>
                </v-btn>
            </div>
            <!-- 入力エリア -->
            <v-textarea
            auto-grow
                class="ma-0 pa-0"
                style="font-size: 13px"
                background-color="transparent"
                rows="1"
                flat
                solo
                dense
                filled
                hide-details
                v-model="note.text"
                v-on:keyup="register()"
                v-bind:class="{ Checked: note.isChecked }"
                v-bind:readonly="isReadonly"
            ></v-textarea>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// import { Note } from "@/models/StrageDB";
import { Inote } from "@/interface/Interface";
import ColorsetComponent from "@/components/Colorset.vue";

@Component({ components: { ColorsetComponent } })
export default class NoteComponent extends Vue {
    @Prop({
        default: () => ({
            id: 1,
            title: "",
            text: "",
            isChecked: false,
            createdAt: "",
            updatedAt: "",
            color: "",
            positionLeft: "",
            positionTop: "",
            sort: 0,
            deleteFlg: 0
        })
    })
    note!: Inote;

    private isReadonly = false;
    private iswritting = false;
    private rating = 3;
    private eventNoneFlg = true;
    public xNum = Math.floor(Math.random() * 20200801) % 6323;//

    @Watch("note.isChecked")
    private noteIsChecked(isChecked: boolean): void {
        this.$emit("register");
        if (isChecked === true) {
            this.isReadonly = true;
        } else {
            this.isReadonly = false;
        }
    }

    @Watch("note.color")
    private noteColorChanged(): void {
        this.$emit("register");
    }

    @Watch("note.title")
    private noteTitleChanged(): void {
        this.$emit("register");
    }

    @Watch("note")
    private noteChanged(): void {
        this.$emit("register");
    }

    // イベント発火
    remove(): void {
        this.$emit("remove");
    }

    /**
     * ゴミ箱に捨てる(一時削除)
     */
    temporaryDeletion(): void {
        this.$emit("temporaryDeletion");
    }

    register(): void {
        this.$emit("register");
    }

    test() {
        this.$emit("test");
    }
}
</script>

<style lang="scss" scoped>
.p-card-header {
    border-radius: 4px 4px 0px 0px;
    max-height: 33px;
}
.p-btn-menu {
    min-width: 24px !important;
    height: 24px !important;
    padding: 0px !important;
    &__moves {
        &:hover {
            cursor: move;
        }
    }
}
.p-btn-blank {
    // margin: 3px;
    font-size: 14px;
    padding: 0px;
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    height: 33px;
    display: inline-flex;
    color: #333;
    border: none;
    outline: none;
}

.v-input--selection-controls__ripple {
    border-radius: 4px !important;
}
.p-textarea {
    &__wrapper {
        width: 100%;
        position: relative;
        background: none;
        &:hover {
            cursor: move;
        }
    }
    &__container {
        border-radius: 4px;
        font-size: 16px;
        background-color: #fff;
        position: relative;
        &:hover {
            cursor: move;
        }
    }
    &__bottom {
        padding: 4px;
        text-align: center;
        font-size: 13px;
    }
}
.Checked {
    text-decoration: line-through;
}

.fade-enter-active {
    transition: opacity 0.5s;
}
.fade-enter {
    opacity: 0;
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
