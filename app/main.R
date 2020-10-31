library(jsonlite)
library(dplyr)
library(rtweet)
library(ggplot2)
library(tidytext)

# Twitter APIの認証情報読み込み
auth <- "auth.json" %>%
  read_json(simplifyVector = TRUE)

# Twitter APIアクセス用トークン取得
token <- create_token(
  app = auth$MY_APP,
  consumer_key = auth$CONSUMER_KEY,
  consumer_secret = auth$CONSUMER_SECRET,
  access_token = auth$ACCESS_TOKEN,
  access_secret = auth$ACCESS_SECRET
)
