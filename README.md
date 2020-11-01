# tweet-analyzer
ツイートを取得し，テキストアナリティクス・自然言語処理の手法で分析する．

## 開発環境
- RStudio

## 環境構築
### プロジェクトをクローン
```bash
$ git clone https://github.com/kota-tozawa/tweet-analyzer.git
$ cd tweet-analyzer
```
### 開発に必要なパッケージをインストール（コンソール上でおこなう）
```R
> install.packages("renv")
> renv::restore()
```
### 新たに導入したパッケージを`renv.lock`に記録（コンソール上でおこなう）
```R
> renv::snapshot()
```
### 静的コード解析（コンソール上でおこなう）
```R
> lintr::lint_dir(path = "src")
```