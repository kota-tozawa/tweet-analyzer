library(jsonlite)
library(dplyr)
library(rtweet)

# Twitter APiからツイート情報取得
download_tweets <- function(user) {
  auth <- "ingestion/common/consts/auth.json" %>%
    read_json(simplifyVector = TRUE)

  # Twitter APIアクセス用トークン取得
  # TODO トークンが正しくない値の場合に起きる例外をキャッチしてログで表示
  token <- create_token(
    app = auth$APP,
    consumer_key = auth$CONSUMER_KEY,
    consumer_secret = auth$CONSUMER_SECRET,
    access_token = auth$ACCESS_TOKEN,
    access_secret = auth$ACCESS_SECRET
  )

  # ユーザーのツイート（リツイート含む）を取得
  tws <- get_timeline(user, n = 3200)
  # 見易さのため、カラム名を大文字に
  names(tws) <- toupper(names(tws))

  # 上で取得したツイート情報を保存（何度もAPIにリクエストを送らないため，一時的に保存）
  setwd("./output/raw/rdata")
  filename <- paste0(user, ".Rdata")
  save(tws, file = filename)
  setwd("../../../")
}