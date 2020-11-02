# tweet-analyzer
ツイートを取得し，テキストアナリティクス・自然言語処理の手法で分析する．

## 開発環境
RStudioを用いる．\
ローカルのPCにRStudioをインストールしてもよいし，Dockerコンテナ上でRStudioを起動して開発を行ってもよい．\
下記にはDockerを用いて開発環境を構築する方法を記す．

## 環境構築（Docker）
### Dockerイメージ取得・コンテナ起動（怒られるのでとりあえずパスワードは設定しておく）
```bash
$ docker run -p 8787:8787 -e PASSWORD=yourpasswordhere rocker/rstudio
```
### 「ホストアドレス:8787」でブラウザからRStudioにアクセス
```
http://localhost:8787/
```
### サインイン
```
Username: rstudio
Password: yourpasswordhere
```
### プロジェクトをクローン
```bash
$ git clone https://github.com/kota-tozawa/tweet-analyzer.git
$ cd tweet-analyzer
```
### 実行中のコンテナの状態を保存し，次作業するときに以前の状態からはじめる方法
```bash
hogehoge@abcde ~$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS                    NAMES
da13575a8a55        rocker/rstudio      "/init"             About a minute ago   Up About a minute   0.0.0.0:8787->8787/tcp   interesting_williams
hogehoge@abcde ~$ docker commit da13575a8a55 foobar
sha256:4f49a8f25a428bc54b1c4902b1e2ffd559d276bdf734a674819046aaeb700cc4
hogehoge@abcde ~$ docker images
REPOSITORY                TAG                 IMAGE ID            CREATED              SIZE
foobar                    latest              4f49a8f25a42        About a minute ago   1.9GB
rocker/verse              latest              acb9adf64bd9        8 days ago           3.62GB
rocker/rstudio            latest              f6cf30c3483b        8 days ago           1.9GB
hogehoge@abcde ~$ docker run -p 8787:8787 -e PASSWORD=yourpasswordhere foobar
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
### 開発に必要なパッケージをインストール（RStudioのコンソール上でおこなうとよい）
```R
> install.packages("renv")
> renv::restore()
```
## 開発していくなかで適宜行うべきこと
### 新たに導入したパッケージを`renv.lock`に記録（RStudioのコンソール上でおこなうとよい）
```R
> renv::snapshot()
```
### 静的コード解析（RStudioのコンソール上でおこなうとよい）
```R
> lintr::lint_dir(path = "src")
```