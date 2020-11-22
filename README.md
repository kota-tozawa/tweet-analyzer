# tweet-analyzer
## 概要
特定のユーザーのツイートを取得し、テキストアナリティクス・自然言語処理の手法で分析し、ダッシュボードに表示するアプリケーション。\
フロントエンドは主に React（JavaScript）で、バックエンドは Shiny（R）を用いて実装。

## 目的
あるユーザーがどのように Twitter を利用しているのかをいろいろな側面から可視化すること。\
自分が普段どのように Twitter を使っているのかを振り返るためのツールを作ってみようかなというモチベで作り始めた。

## なぜReactとShinyを組み合わせて使うのか
よりリッチな機能を備えたダッシュボードを簡単に作るため。\
Shiny の枠組みで React を使えるようにする`{reactR}`パッケージを用いた実装も考えたが、がっつり React 使いたいなと思い、React の環境を一から作った。\
この組み合わせでの実装方法を紹介しているブログ記事などはあまり多くなかったが、下記 GitHub リポジトリは非常に参考になった。\
https://github.com/glin/shiny-react-example

## Development
1. Shiny アプリを起動
```bash
$ npm start --silent
```
2. webpack-dev-server を立ち上げる
```bash
$ npm run dev
```
3. [http://localhost:4000](http://localhost:4000)をブラウザで開く（自動で開かれない場合）

## Production
1. React アプリをビルド
```bash
$ npm run build
```
2. Shiny アプリを起動
```bash
$ npm start --silent
```
3. [http://localhost:3000](http://localhost:3000)をブラウザで開く

## 開発環境
R と JavaScript を書いたり動かしたりするのに適したエディタを用いる。（RStudio、VSCode など）\
RStudio に関して、ローカルの PC にインストールしてもよいし、Docker コンテナ上で起動してもよい。\
下記には Docker を用いて RStudio をインストールする方法を記す。

### Dockerコンテナ上でRStudioを使う
1. Docker イメージ取得・コンテナ起動（怒られるのでとりあえずパスワードは設定しておく）
```bash
$ docker run -p 8787:8787 -e PASSWORD=yourpasswordhere rocker/rstudio
```
2. [http://localhost:8787/](http://localhost:8787/)をブラウザで開く
3. `2.`を実行後、サインインの画面が表示されるので、下記のように入力しサインイン
```
Username: rstudio
Password: yourpasswordhere
```
4. RStudio が立ち上がるので、プロジェクトをクローンしてくる
```bash
$ git clone https://github.com/kota-tozawa/tweet-analyzer.git
$ cd tweet-analyzer
```
5. 「環境構築後にやること」を行う

### 実行中のコンテナの状態を保存し、次作業するときに以前の状態からはじめる方法
```bash
hogehoge@fugafuga ~$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS                    NAMES
da13575a8a55        rocker/rstudio      "/init"             About a minute ago   Up About a minute   0.0.0.0:8787->8787/tcp   interesting_williams
hogehoge@fugafuga ~$ docker commit da13575a8a55 foobar
sha256:4f49a8f25a428bc54b1c4902b1e2ffd559d276bdf734a674819046aaeb700cc4
hogehoge@fugafuga ~$ docker images
REPOSITORY                TAG                 IMAGE ID            CREATED              SIZE
foobar                    latest              4f49a8f25a42        About a minute ago   1.9GB
rocker/verse              latest              acb9adf64bd9        8 days ago           3.62GB
rocker/rstudio            latest              f6cf30c3483b        8 days ago           1.9GB
hogehoge@fugafuga ~$ docker run -p 8787:8787 -e PASSWORD=yourpasswordhere foobar
[s6-init] making user provided files available at /var/run/s6/etc...exited 0.
[s6-init] ensuring user provided files have correct perms...exited 0.
[fix-attrs.d] applying ownership & permissions fixes...
[fix-attrs.d] done.
[cont-init.d] executing container initialization scripts...
[cont-init.d] userconf: executing...
[cont-init.d] userconf: exited 0.
[cont-init.d] done.
[services.d] starting services
[services.d] done.
```

## 環境構築後にやること

### 開発に必要なパッケージをインストール

#### Rのパッケージをインストールする
```R
> install.packages("renv")
> renv::restore()
```

#### JavaScriptのパッケージをインストールする
```bash
$ npm install
```

## 開発していくなかで適宜行うべきこと

### renv.lock の更新（R）
```R
> renv::snapshot()
```

### コードと文章の静的解析・整形

#### Rのコードを静的解析する
下記を実行して得られる解析結果を見て、手で整形する。
```R
> lintr::lint_dir(path = "ingestion")
> lintr::lint_dir(path = "tests")
> lintr::lint("app.R")
```

#### JavaScriptのコードを静的解析及び自動整形する
```bash
$ npm run lint-fix
```

#### 日本語の文章を校正及び（部分的に）自動修正する
1. 下記を実行し、機械的に直せるところは直してもらう。
```bash
$ npm run text-fix
```
2. 残った問題点については下記を実行して確認し、手で修正する。
```bash
$ npm run lint-text
```

### テスト

#### R
- ユニットテスト
{testthat}パッケージを用いて行う。
```R
> testthat::test_dir("./tests/testthat")
```

#### JavaScript（React）
