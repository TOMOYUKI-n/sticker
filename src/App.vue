<template>
    <v-app class="p-app__wrap">
        <Header
            @alltruncateDb="alltruncateDb"
            @addNewSticker="addNewSticker"
            @all-update="backStickerFromTrash"
            @reload="reload"
            :isSaveLoading="isSaveLoading"
        />
        <div style="height: 93vh; position: relative; top: 64px;">
            <div v-if="!notes.length">
                <FirstAlert />
                <SuccessAlert v-if="successAlert" />
            </div>
            <v-sheet
                v-else
                id="scrolling"
                class="overflow-y-auto"
                style="height: 100%;"
                >
                <div
                    class="ma-2 grid"
                    style="padding: 0px;"
                    ref="grid"
                >
                    <div class="grid-sizer"></div>
                    <div
                        :stickerId="note.id"
                        :id="note.id"
                        class="grid-item pa-1"
                        v-for="note in notes"
                        :key="note.id"
                        ref="parents"
                    >
                        <NoteComponent
                            ref="sticker"
                            style="width: 100%;"
                            v-bind:note="note"
                            @temporaryDeletion="temporaryDeletion(key, note)"
                            @register="register(note)"
                            @transitions="transitions()"
                            @test="droped(key, note)"
                        />
                    </div>
                </div>
            </v-sheet>
        </div>

        <v-footer class="p-app__add-sp">
            <v-btn fab dark color="cyan" v-on:click="addNewSticker()">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from "vue-property-decorator";
import NoteComponent from "@/components/Note.vue";
import FirstAlert from "@/components/FirstAlert.vue";
import SuccessAlert from "@/components/SuccessAlert.vue";
import Header from "@/components/Header/Header.vue";
// DB/i
import { NoteRepository } from "@/models/StrageDB";
import { Inote } from "@/interface/Interface";
// plugin
import { v4 } from "uuid";
import moment from "moment";
import swal from "sweetalert";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Packery = require("packery");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Draggabilly = require("draggabilly");

@Component({
    components: {
        NoteComponent,
        FirstAlert,
        SuccessAlert,
        Header
    }
})
export default class App extends Vue {
    private notes: Inote[] = [];
    private noteRepository = new NoteRepository();
    private dates = this.moment(new Date());
    private dragStartKey = 0;
    private dragOverKey = 0;
    private successAlert = false;
    private isSaveLoading = false;
    private targetElementPosition!: HTMLElement;
    @Ref() readonly parents!: HTMLElement[];
    @Ref() readonly grid!: HTMLElement[];
    @Ref() sticker!: Vue[];
    private pckry: any | null = null;

    /**
     * 新規登録処理
     */
    async addNewSticker(): Promise<void> {
        const newNote = {
            id: v4(),
            title: "",
            text: "",
            isChecked: false,
            createdAt: this.dates,
            updatedAt: this.dates,
            color: "#78CDEA",
            sort: this.notes.length,
            deleteFlg: 0
        };
        this.notes.push(newNote);
        await this.noteRepository.save(newNote);
        this.$nextTick(() => {
            if (this.pckry === null) {
                this.generateGrid();
                return;
            }
            // 親要素から新規idの要素を取得
            const el = this.parents.find(x => x.id === newNote.id);
            // packeryに追加
            this.pckry.appended(el);
            const draggie = new Draggabilly(el);
            this.pckry.bindDraggabillyEvents(draggie);
            this.pckry.shiftLayout();
        });
    }

    private async mounted(): Promise<void> {
        await this.fetchNoteData();
        if (this.notes.length === 0) {
            return;
        }
        this.$nextTick(() => {
            this.generateGrid();
            this.reDraw();
        });
    }

    /**
     * packeryインスタンス生成
     */
    private generateGrid(): void {
        const grid = this.grid;
        this.pckry = new Packery(grid, {
            itemSelector: ".grid-item",
            columnWidth: ".grid-sizer",
            percentPosition: true
        });
        this.pckry.getItemElements().forEach((itemElem: HTMLElement) => {
            const draggie = new Draggabilly(itemElem);
            this.pckry.bindDraggabillyEvents(draggie);
        });
    }

    /**
     * メモデータ取得
     */
    async fetchNoteData(): Promise<void> {
        await this.noteRepository.openDb();
        const notedata = await this.noteRepository.load();
        this.notes = notedata.filter(x => x.deleteFlg === 0);
        this.notes = this.notes.sort((x, y) => (x.sort > y.sort ? 1 : -1));
    }

    /**
     * ゴミ箱から戻した時の描画
     */
    async backStickerFromTrash(): Promise<void> {
        await this.fetchNoteData();
        this.$nextTick(() => {
            this.generateGrid();
        });
    }

    /**
     * 再描画
     */
    async reDraw(): Promise<void> {
        setTimeout(() => {
            this.pckry.layout();
        }, 400);
    }

    /**
     * 強制更新
     */
    private async reload(): Promise<void> {
        this.droped();
        this.pckry.layout();
    }

    /**
     * 保存
     * nodeのsidと一致したthis.notesのidに対して、nodeのiを this.notesのsortに上書きする
     */
    async droped(): Promise<void> {
        this.isSaveLoading = true;
        // packeryにある要素のstickerIdの一覧オブジェクトを生成
        const elems = this.pckry.getItemElements();
        const node = elems.map((elem: string, i: number) => ({
            sid: elems[i].attributes[1].nodeValue
        }));

        // 配列化
        const list: any[] = [];
        for (let i = 0; i < node.length; i++) {
            list[i] = node[i];
        }

        // 全てのノートのsortをstickerIdに更新
        const result = this.notes.map((note, i) => {
            const [target] = this.notes.filter(x => x.id === list[i].sid);
            target.sort = i;
            return this.noteRepository.save(target);
        });
        await Promise.all(result);
        this.isSaveLoading = false;
    }

    /**
     * データベース登録処理 全件登録
     */
    async register(notes: Inote): Promise<void> {
        await this.noteRepository.save(notes);
        this.pckry.shiftLayout();
    }

    /**
     * 一時的に削除
     */
    private async temporaryDeletion(index: number, note: Inote): Promise<void> {
        // packeryから削除
        const el = this.parents.find(x => x.id === note.id);
        this.pckry.remove(el);
        this.pckry.shiftLayout();
        setTimeout(() => {
            // vueから削除
            this.notes = this.notes.filter(x => x.id !== note.id);
            this.noteRepository.updates(note);
        }, 300);
    }

    /**
     * 日付変換
     */
    moment(dates: Date): string {
        return moment(dates).format("YYYY年MM月DD日 HH:mm");
    }

    /**
     * 一覧とゴミ箱にある全ての sticker を削除します
     */
    async alltruncateDb(): Promise<void> {
        if (
            (await swal("一覧とごみ箱の全てのタスクを削除しますか？")) === true
        ) {
            await this.noteRepository.allDelete();
            // 全て再描画
            location.reload();
        }
    }
}
</script>
<style lang="scss" scoped>
.grid {
   // background: #DDD;
   width: 100%;
}

.grid-item,
.grid-sizer {
    width: calc(25% - 4px);
    box-sizing: border-box;
}

/**掴んだ時 */
.grid-item.is-dragging,
.grid-item.is-positioning-post-drag {
    // box-sizing: border-box;
    // border: 4px solid rgba(90, 199, 250, 0.5);
    // border-radius: 5px;
    z-index: 2;
}

.grid-item{
    // transition: all 0.5s;
    // position: absolute;
    // top: 0;
    // left: 0;
}

.packery-drop-placeholder {
    outline: 3px dashed hsla(0, 0%, 0%, 0.5);
    outline-offset: -6px;
    -webkit-transition: -webkit-transform 0.2s;
            transition: transform 0.2s;
}

// @media screen and (max-width: 2560px) {
//     .grid-item {
//         width: 20%;
//     }
//     .grid-sizer {
//         width: 20%;
//     }
// }
// @media screen and (max-width: 1904px) {
//     .grid-item {
//         width: calc((100% - (10px * 6)) / 4);
//     }
//     .grid-sizer {
//         // (100% - (gutterの値 * columnの間の数)) / column数)
//         // width: calc((100% - (10px * 6)) / 4);
//         width: calc((100% - (10px * 6)) / 4);
//     }
// }
// @media screen and (max-width: 1341px) {
//     .grid-item {
//         // width: calc((100%) / 4);
//         width: 25%;
//     }
// }
// @media screen and (max-width: 1280px) {
//     .grid-item {
//         // width: calc((100%) / 4);
//         width: 28%;
//     }
// }
// @media screen and (max-width: 1264px) {
//     .grid-item {
//         // width: calc((100% - (10px * 4)) / 3);
//         width: 30%;
//     }
// }
// @media screen and (max-width: 960px) {
//     .grid-item {
//         width: calc((100% - (10px * 2)) / 2);
//     }
//     .grid-sizer {
//         width: calc((100% - (10px * 2)) / 2);
//     }
// }
// @media screen and (max-width: 600px) {
//     .grid-item {
//         width: 100%;
//     }
// }

/*
 * headerエリア
 */
.p-app {
    &__add-sp {
        display: none;
    }
}
@media screen and (max-width: 600px) {
    .p-app {
        &__add-sp {
            display: flex;
            position: fixed;
            bottom: 0;
            background-color: transparent;
            right: 0px;
        }
    }
}
</style>
