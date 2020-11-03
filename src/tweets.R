library(jsonlite)
library(dplyr)
library(rtweet)

# Twitter APIの認証情報読み込み
auth <- "auth.json" %>%
  read_json(simplifyVector = TRUE)

# Twitter APIアクセス用トークン取得
token <- create_token(
  app = auth$APP,
  consumer_key = auth$CONSUMER_KEY,
  consumer_secret = auth$CONSUMER_SECRET,
  access_token = auth$ACCESS_TOKEN,
  access_secret = auth$ACCESS_SECRET
)

# ユーザーのツイート（リツイート含む）を取得
user <- "tzwqq"
tws <- get_timeline(user, n = 3200)

# 上で取得したツイート情報を保存（何度もAPIにリクエストを送らないため，一時的に保存）
setwd("./output/tmp_data")
filename <- paste(user, ".Rdata", sep = "")
save(tws, file = filename)
setwd("../../")
