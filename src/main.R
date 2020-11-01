library(jsonlite)
library(dplyr)
library(rtweet)
library(ggplot2)
library(lubridate)
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

# ユーザーのツイートを取得（nは最大3200まで）
user <- "tzwqq"
tws <- get_timeline(user, n = 3200)

# 上で取得したツイート情報を保存（何度もAPIにリクエストを送らないため，一時的に保存）
# setwd("./output_tmp")
# filename <- paste(user, "tmp.Rdata", sep = "_")
# save(tws, file = filename)
# setwd("../")
# 
# Rオブジェクトとして保存したツイート情報をロード
# setwd("./output_tmp")
# load(filename)
# setwd("../")

# 月次ツイート数の推移を可視化
tws$created_at <- ymd_hms(tws$created_at)
tws %>%
  ggplot(aes(x = created_at)) +
  geom_histogram(aes(fill = ..count..), bins = 100) +
  theme_minimal() +
  theme(legend.position = "none") +
  scale_fill_gradient2(low = "midnightblue", high = "aquamarine4") +
  labs(
    x = "Month", y = "Frequency of Tweets by Month",
    title = "Histogram of Frequency of Tweets by Month",
    subtitle = "Darkness of the green is proportional to the number of tweets"
  )
