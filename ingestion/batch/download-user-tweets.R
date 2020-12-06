#' Twitter APIからツイートデータ取得
#'
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 取得するツイートの数（最大3200まで）
#' \code{download_user_tweets} Twitter API にリクエストを送り、特定のユーザーのツイートデータ（RT含む）を取得し、.Rdataとして保存する
#' @return 戻り値無し
#' @examples
#' download_user_tweets("Twitter", ntweets = 1600)
#' download_user_tweets("Twitter", ntweets = "100")

library(jsonlite)
library(dplyr)
library(rtweet)

download_user_tweets <- function(user, ntweets) {
  n <- as.numeric(ntweets)

  # Twitter APIを叩くために必要なシークレットを読み込み
  auth <- "ingestion/batch/auth.json" %>%
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

  # 指定したユーザーのツイートを取得
  tws <- get_timeline(user, n = n)

  # 見易さのため、カラム名を大文字に
  names(tws) <- toupper(names(tws))

  # 上で取得したツイート情報を保存（何度もAPIにリクエストを送らないため、一時的に保存）
  filename <- paste0("./output/raw/rdata/", user, "-", ntweets, ".Rdata")
  save(tws, file = filename)
}
