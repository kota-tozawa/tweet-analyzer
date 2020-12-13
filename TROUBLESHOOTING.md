## `npm run build` && `npm start`してもなぜか最新のコンポーネントの状態で画面が表示されない

dist 配下のファイルを全削除したのちに再度 `npm run build` && `npm start` する。\
それでもダメなら、 http://localhost:3000 をリロードする際に `Shift` + `Cmd` + `R` で、ブラウザ上のキャッシュをクリアしてリロードする。

## エラー：「stopifnot(is.character(app)) でエラー: オブジェクト 'app' がありません」

Twitter API 用のシークレット環境変数がプロジェクトルート上の `.Renviron` に定義されていない。\
 以下のように定義しておく（アスタリスクは適宜置き換える）：

```
APP="********"
CONSUMER_KEY="********"
CONSUMER_SECRET="****************"
ACCESS_TOKEN="****************"
ACCESS_SECRET="****************"
```
