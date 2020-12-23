library(dplyr)
library(rtweet)

#' Twitter APIからツイートデータ取得
#'
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 取得するツイートの数（最大3200まで）
#' \code{download_user_tweets} Twitter API にリクエストを送り、特定のユーザーのツイートデータ（RT含む）を取得し、.Rdataファイルとして保存する
#' @return 戻り値無し
#' @examples
#' download_user_tweets("Twitter", ntweets = 1600)
#' download_user_tweets("Twitter", ntweets = "100")
download_user_tweets <- function(user, ntweets) {
  ntweets <- parse_numeric(ntweets)

  # Twitter APIアクセス用のトークンを生成するためのシークレットを環境変数から読み込む
  app <- Sys.getenv("APP")
  consumer_key <- Sys.getenv("CONSUMER_KEY")
  consumer_secret <- Sys.getenv("CONSUMER_SECRET")
  access_token <- Sys.getenv("ACCESS_TOKEN")
  access_secret <- Sys.getenv("ACCESS_SECRET")

  # トークン生成
  token <- create_token(
    app = app,
    consumer_key = consumer_key,
    consumer_secret = consumer_secret,
    access_token = access_token,
    access_secret = access_secret
  )

  # 指定したユーザーのツイートを取得
  tws <- get_timeline(user, n = ntweets)

  # 見易さのため、カラム名を大文字に
  names(tws) <- toupper(names(tws))

  # 上で取得したツイート情報を保存（何度もAPIにリクエストを送らないため、一時的に保存）
  filepath <- path_to_tweet_data(user, ntweets)
  save(tws, file = filepath)
}
