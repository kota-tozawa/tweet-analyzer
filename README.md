# tweet-analyzer
ツイートを取得し，テキストアナリティクス・自然言語処理の手法で分析し，ダッシュボードに表示するアプリケーション．\
フロントエンドに，Shiny（RのWebアプリケーションフレームワーク）とReact（JavaScriptフレームワーク）を用いている．

## dev実行
1. Shinyアプリを起動
```bash
$ npm start
```
2. webpack-dev-serverを立ち上げる
```bash
$ npm run dev
```
3. [http://localhost:4000](http://localhost:4000)をブラウザで開く
## prd実行
1. Reactアプリをビルド
```bash
$ npm run build
```
2. Shinyアプリを起動
```bash
$ npm start
```
3. [http://localhost:3000](http://localhost:3000)をブラウザで開く
## 開発環境
RStudioと，必要に応じてVSCodeを用いる．\
RStudioに関して，ローカルのPCにインストールしてもよいし，Dockerコンテナ上で起動して開発を行ってもよい．\
下記にはDockerを用いてRStudioをインストールする方法を記す．

### Dockerコンテナ上でRStudioを使う
1. Dockerイメージ取得・コンテナ起動（怒られるのでとりあえずパスワードは設定しておく）
```bash
$ docker run -p 8787:8787 -e PASSWORD=yourpasswordhere rocker/rstudio
```
2. [http://localhost:8787/](http://localhost:8787/)をブラウザで開く
3. `2.`を実行後，サインインの画面が表示されるので，下記のように入力しサインイン
```
Username: rstudio
Password: yourpasswordhere
```
4. RStudioが立ち上がるので，プロジェクトをクローンしてくる
```bash
$ git clone https://github.com/kota-tozawa/tweet-analyzer.git
$ cd tweet-analyzer
```
5. 「環境構築後にやること」を行う
### 実行中のコンテナの状態を保存し，次作業するときに以前の状態からはじめる方法
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
$ npm run install
```
## 開発していくなかで適宜行うべきこと
### 新たに導入したRのパッケージを`renv.lock`に記録する
```R
> renv::snapshot()
```
### コードの静的解析・整形
#### Rのコードを静的解析する（下記を実行して得られる解析結果を見て，手でコードを整形する）
```R
> lintr::lint_dir(path = "ingestion")
```
#### JavaScriptのコードを静的解析及び自動整形する
```bash
$ npm run lint-fix
```