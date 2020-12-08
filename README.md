# tweet-analyzer

## 概要

特定のユーザーのツイートを取得し、テキストアナリティクス・自然言語処理の手法で分析し、ダッシュボードに表示するアプリケーション。\
フロントエンドは主に React（JavaScript）で、バックエンドは Shiny（R）を用いて実装。

## 目的

あるユーザーがどのように Twitter を利用しているのかをいろいろな側面から可視化すること。\
自分が普段どのように Twitter を使っているのかを振り返るためのツールを作ってみようかなというモチベで作り始めた。

## なぜ React と Shiny を組み合わせて使うのか

理由の 1 つは、リッチな機能を備えたダッシュボードを簡単に作るため。\
2 つ目は、ちょうど React を勉強したいと思っていて、テキストマイニング・NLP 関係は R で書きたいと思ったから。\
よって、自然に React と Shiny を組み合わせて使う発想に至った。\
Shiny の枠組みで React を使えるようにする `{reactR}` パッケージを用いた実装も考えたが、\
React 環境をスクラッチから自分で用意する方が、自由度の高い実装が可能だと考えた。

## 注意事項

Twitter API と AWS SDk 用のシークレットを事前に用意しないと動かない。

## Development

1. Shiny アプリを起動

```zsh
$ npm start --silent # もしくは npm start -s
```

2. webpack-dev-server を立ち上げる

```zsh
$ npm run dev
```

3. [http://localhost:4000](http://localhost:4000)をブラウザで開く（自動で開かれない場合）

## Production

1. React アプリをビルド

```zsh
$ npm run build
```

2. Shiny アプリを起動

```zsh
$ npm start --silent # もしくは npm start -s
```

3. [http://localhost:3000](http://localhost:3000)をブラウザで開く

## 開発環境

R と JavaScript を書いたり動かしたりするのに適したエディタを用いる。（eg: RStudio、VSCode）
いれておくと良い VSCode 拡張機能に関しては .vscode/README.md 参照。\
RStudio に関して、ローカルの PC にインストールしてもよいし、Docker コンテナ上で起動してもよい。\
下記には Docker を用いて RStudio をインストールする方法を記す。

### Docker コンテナ上で RStudio を使う

1. Docker イメージ取得・コンテナ起動（怒られるのでとりあえずパスワードは設定しておく）

```zsh
$ docker run -p 8787:8787 -e PASSWORD=yourpasswordhere rocker/rstudio
```

2. [http://localhost:8787/](http://localhost:8787/)をブラウザで開く
3. `2.`を実行後、サインインの画面が表示されるので、下記のように入力しサインイン

```
Username: rstudio
Password: yourpasswordhere
```

4. RStudio が立ち上がるので、プロジェクトをクローンしてくる

```zsh
$ git clone https://github.com/kota-tozawa/tweet-analyzer.git
$ cd tweet-analyzer
```

5. 「環境構築後にやること」を行う

### 実行中のコンテナの状態を保存し、次作業するときに以前の状態からはじめる方法

```zsh
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

#### R のパッケージをインストールする

```R
> install.packages("renv")
> renv::restore()
```

#### JavaScript のパッケージをインストールする

```zsh
$ npm install
```

## 開発していくなかで適宜行うべきこと

### パッケージ管理

#### R

使うパッケージを変えたり、新しくインストールしたりしたときに行う。\
できる限り CRAN からパッケージをインストールする。（`install_github("package-name")`より `install.packages("package-name")` が望ましい）

```R
> renv::snapshot()
```

#### JavaScript

`npm install <package-name>`時に package-lock.json と package-lock.json が自動で生成されるため、特に何もしなくて良い。\
dev 環境のみで使用するパッケージをインストールするときは、`--save-dev`オプションをつける。

### コードと文章の静的解析・整形

#### R のコードを静的解析する

下記を実行して得られる解析結果を見て、手で整形する。

```R
> lintr::lint_dir(path = "ingestion")
> lintr::lint_dir(path = "tests")
> lintr::lint("app.R")
```

#### JavaScript のコードを静的解析及び自動整形する

```zsh
$ npm run lint-fix
```

#### README.md の日本語の文章を校正及び（部分的に）自動修正する

1. 下記を実行し、機械的に直せるところは直してもらう。

```zsh
$ npm run text-fix
```

2. 残った問題点については下記を実行して確認し、手で修正する。

```zsh
$ npm run lint-text
```

### テスト

#### R

- ユニットテスト \
  {testthat}パッケージを用いて行う。

```R
> testthat::test_dir("./tests/testthat")
```

#### JavaScript（React）

Jest + enzyme でそのうち書く予定。
