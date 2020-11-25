library(testthat)

test_check("tweet-analyzer")

# テストデータ読み込み（2020/11/22に3200件取得した厚生労働省のツイートデータ）
tws <- load("../../output/raw/rdata/_testdata.Rdata")
# 前処理
tws$CREATED_AT <- as.character(tws$CREATED_AT) %>%
  substr(1, 10) %>%
  ymd()
