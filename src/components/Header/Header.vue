<template>
        <v-app-bar app color="#24292e" dark absolute elevate-on-scroll scroll-target="#scrolling">
            <v-btn text fab icon>
                <v-icon @click="alltruncateDb">mdi-collage</v-icon>
            </v-btn>
            <v-toolbar-title class="pl-0">N-Sticker</v-toolbar-title>
            <v-row class="d-flex" justify="end">
                <div v-if="isSaveLoading" class="d-flex align-center">
                    <caption style="opacity:0.7;" class="mr-1">保存中...</caption>
                    <v-progress-circular
                        indeterminate
                        color="accent"
                        class="ma-1 mr-4"
                    ></v-progress-circular>
                </div>
                <v-btn class="mr-2 p-trash__btn" fab small dark color="#616161"
                    @click="reload"
                >
                    <v-icon dark>mdi-reload</v-icon>
                </v-btn>
                <v-menu bottom left offset-y :close-on-content-click="false" :close-on-click="false" transition="slide-y-transition">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mr-2 p-trash__btn" v-bind="attrs" v-on="on" fab small dark color="#616161"
                            @click="getTrashes"
                        >
                            <v-icon dark>mdi-delete-empty</v-icon>
                        </v-btn>
                    </template>
                    <v-card class="p-trash__container">
                        <v-card-title class="py-3 px-5" style="background: #eff1f3;">
                            <div class="sp__text">ごみ箱</div>
                            <v-icon class="sp__text" small>mdi-delete-outline</v-icon>
                        </v-card-title>
                        <v-container class="px-0 p-trash__height sp__height">
                            <v-data-table
                                :headers="headers"
                                :items="trashes"
                                :items-per-page="-1"
                                :fixed-header="true"
                                :loading="isLoading"
                                loading-text="データ取得中..."
                                no-data-text="データがありません"
                                hide-default-footer
                                dense
                                class="mx-0"
                            >
                                <template v-slot:[`item.color`]="{ item }">
                                    <td>
                                        <div class="p-trash__color" :style="'background:' + item.color"></div>
                                    </td>
                                </template>
                                <template v-slot:[`item.title`]="{ item }">
                                    <td>
                                        <div style="font-size: 12px;">{{ item.title }}</div>
                                    </td>
                                </template>
                                <template v-slot:[`item.text`]="{ item }">
                                    <td>
                                        <div style="font-size: 12px;">{{ item.text }}</div>
                                    </td>
                                </template>
                                <template v-slot:[`item.updatedAt`]="{ item }">
                                    <td>
                                        <div style="font-size: 12px;">{{ item.updatedAt }}</div>
                                    </td>
                                </template>
                                <template v-slot:[`item.action`]="{ item }">
                                    <td>
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" class="elevation-0 pa-0" color="transparent" offset min-width="40px">
                                                    <v-icon color="#1565C0" small @click="backsticker(item)">mdi-restore</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>戻す</span>
                                        </v-tooltip>
                                    </td>
                                    <td>
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" class="elevation-0 pa-0" color="transparent" offset min-width="40px">
                                                    <v-icon color="red" small @click="remove(item)">mdi-trash-can-outline</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>削除</span>
                                        </v-tooltip>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-container>
                    </v-card>
                </v-menu>
                <v-btn class="mr-2 p-app__add-pc" fab small dark color="#0366d6" v-on:click="addNewSticker()">
                    <v-icon dark>mdi-plus</v-icon>
                </v-btn>
            </v-row>
        </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { NoteRepository } from "@/models/StrageDB";
import { Inote } from "@/interface/Interface";
@Component({
    components: {}
})
export default class Header extends Vue {
    @Prop() isSaveLoading!: boolean;
    private trashes: Inote[] = [];
    private noteRepository = new NoteRepository();
    private isLoading = false;

    private headers = [
        { text: "", value: "color", width: 40 },
        { text: "タイトル", value: "title", width: 150 },
        { text: "内容", value: "text", width: 150 },
        { text: "更新日", value: "updatedAt", width: 140 },
        { text: "", value: "action", width: 100 }
    ];

    /**
     * ゴミ箱データ取得
     */
    private async getTrashes(): Promise<void> {
        await this.noteRepository.openDb();
        const notedata = await this.noteRepository.load();
        this.trashes = notedata.filter(x => x.deleteFlg === 1);
    }

    /**
     * ゴミ箱から戻す
     */
    async backsticker(item: Inote): Promise<void> {
        await this.noteRepository.backupdates(item);
        await this.getTrashes();
        // noteの更新
        this.$emit("all-update");
    }

    /**
     * 削除する
     */
    async remove(item: Inote): Promise<void> {
        await this.noteRepository.remove(item);
        await this.getTrashes();
    }

    /**
     * 全削除
     */
    async alltruncateDb(): Promise<void> {
        this.$emit("alltruncateDb");
    }

    /**
     * 新規追加
     */
    async addNewSticker(): Promise<void> {
        this.$emit("addNewSticker");
    }

    /**
     * 更新
     */
    private async allUpdate(): Promise<void> {
        this.$emit("all-update");
    }

    /**
     * 再描画
     */
    private async reload(): Promise<void> {
        this.$emit("reload");
    }
}
</script>

<style lang="scss" scoped>
.successtrans-enter {
    transform: translateX(100vw);
    opacity: 0.9;
}

.successtrans-enter-to {
    transform: translateX();
}
.successtrans-enter-active {
    transition: all 1s ease-out;
}

.successtrans-leave-active {
    transition: all 1s ease-in;
}
.successtrans-leave-to {
    transform: translateX(100vh);
    opacity: 0.1;
}

.wrappers-enter-active {
    transition: all 2s ease-in-out;
}

.p-app {
    &__add-pc {
        background-color: transparent;
        &:hover {
            transform: translateY(-3px);
        }
    }
}
@media screen and (max-width: 600px) {
    .p-app {
        &__add-pc {
            display: none;
        }
    }
}
.p-trash{
    &__btn {
        &:hover {
            transform: translateY(-3px);
        }
    }
}
.p-trash {
    &__container{
        width: 750px;
    }
    &__height{
        max-height:70vh;
        overflow-y: scroll;
    }
    &__color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
    }
}
.sp{
    &__text{
        font-size: 16px;
    }
}
@media screen and (max-width: 600px) {
    .p-trash {
        &__container {
            min-width: 100%;
        }
    }
    .sp{
        &__text{
            font-size: 15px;
        }
        &__height{
            max-height: 80vh;
            overflow-y: scroll;
        }
    }
}
</style>
