import { Inote } from "@/interface/Interface";

const dbName = "NoteDB";
const storeName = "NoteStore";

/**
 * DB処理をまとめたクラス
 */
export class NoteRepository {
    private Notes: Inote[] = [];
    private Database: IDBDatabase | null = null;

    /**
     * DB open
     * @return
     */
    openDb(): Promise<void> {
        return new Promise(resolve => {
            const indexedDB = window.indexedDB;
            const openReq = indexedDB.open(dbName, 4);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            openReq.onsuccess = (event: any) => {
                // onupgradeneededの後に実行。更新がない場合はこれだけ実行
                if (event && event.target) {
                    this.Database = event.target.result as IDBDatabase;
                }
                resolve();
            };

            // オブジェクトストアを生成
            openReq.onupgradeneeded = e => {
                if (!e || !e.target) return;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const db = (e.target as any).result as IDBDatabase;
                const stored = db.createObjectStore(storeName, {
                    keyPath: "id"
                });
                stored.createIndex("index", "id");
            };

            openReq.onerror = e => {
                // 接続に失敗
                if (!e || !e.target) return;
                throw new Error("接続に失敗しました");
            };
        });
    }

    /**
     * 保存する
     * @param note
     */
    save(note: Inote): void {
        if (!this.Database) {
            return;
        }
        const trans = this.Database.transaction(storeName, "readwrite");
        const store = trans.objectStore(storeName);
        store.put(note);
    }

    /**
     * 一時削除する 一覧からごみ箱へ移す deleteFlgを1にする
     * @param note
     */
    updates(note: Inote): void | Promise<void> {
        if (!this.Database) {
            return;
        }
        const trans = this.Database.transaction(storeName, "readwrite");
        const store = trans.objectStore(storeName);

        return new Promise(resolve => {
            store.get(note.id).onsuccess = () => {
                note.deleteFlg = 1;
                store.put(note).onsuccess = () => {
                    resolve();
                };
            };
        });
    }

    /**
     * ごみ箱から一覧に戻す deleteFlgを0にする
     * @param note
     */
    backupdates(note: Inote): void | Promise<void> {
        if (!this.Database) {
            return;
        }
        const trans = this.Database.transaction(storeName, "readwrite");
        const store = trans.objectStore(storeName);

        return new Promise(resolve => {
            store.get(note.id).onsuccess = () => {
                note.deleteFlg = 0;
                store.put(note).onsuccess = () => {
                    resolve();
                };
            };
        });
    }

    /**
     * ごみ箱から特定のデータ1件を削除する
     * @param item
     */
    remove(trash: Inote): void {
        if (!this.Database) {
            return;
        }
        const trans = this.Database.transaction(storeName, "readwrite");
        const store = trans.objectStore(storeName);
        store.delete(trash.id);
    }

    /**
     * データベースを削除する（全件削除）
     */
    allDelete(): void | Promise<void> {
        if (!this.Database) {
            return;
        }
        const trans = this.Database.transaction(storeName, "readwrite");
        const store = trans.objectStore(storeName);
        return new Promise(resolve => {
            store.clear().onsuccess = () => {
                resolve();
            };
        });
    }

    /**
     * DBにあるデータを読み込む
     */
    load(): Promise<Inote[]> {
        if (!this.Database) {
            return new Promise(resolve => {
                resolve([]);
                // 非同期終了
            });
        }
        const trans = this.Database.transaction(storeName, "readonly");
        const store = trans.objectStore(storeName);
        const ResetAll = store.getAll();
        return new Promise(resolve => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ResetAll.onsuccess = (e: any) => {
                resolve(e.target.result || []);
            };
        });
    }
}
