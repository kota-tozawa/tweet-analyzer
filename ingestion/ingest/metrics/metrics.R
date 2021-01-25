library(dplyr)
library(tidyr)
library(stringr)
library(lubridate)

#' 各種メトリクスを算出
#'
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 最新のツイートから何ツイート分までを対象とするか
#' \code{metrics} download_user_tweets()で得たツイートデータから、Rechartsで可視化するために必要な値を取り出して加工し、リストにして返す
#' user: Twitterユーザー名
#' retweet_ratio: リツイート割合（ツイートのうち何割がリツイートか）
#' total_favs: ツイートのいいねされた回数合計（リツイートは含まない）
#' total_retweets: ツイートがリツイートされた回数合計（リツイートは含まない）
#' mentioned_users: 最も多くメンションされたユーザートップ10
#' mention_freqs: メンション回数のリスト
#' metrics: 上記メトリクスをまとめたリスト
#' @return metrics
#' @examples
#' metrics("Twitter", ntweets = 400)
#' metrics("Twitter", ntweets = "3,200")
metrics <- function(user, ntweets) {
  ntweets <- parse_numeric(ntweets)

  # Rオブジェクトとして保存したツイートデータをロード
  path <- path_to_tweet_data(user, ntweets)
  load(path)

  # リツイート割合（ツイートのうち何割がリツイートか）を求める
  is_retweet_df <- tws %>% select(IS_RETWEET) %>% group_by() %>% count(IS_RETWEET)
  num_retweets <- is_retweet_df[1, 2] %>% as.numeric()
  num_all_tweets <- nrow(tws) %>% as.numeric()
  retweet_ratio <- num_retweets / num_all_tweets

  # ツイートのいいねされた回数合計（リツイートは含まない）
  total_favs <- tws %>% dplyr::filter(IS_RETWEET == FALSE) %>% select(FAVORITE_COUNT) %>% sum() %>% as.numeric()

  # ツイートがリツイートされた回数合計（リツイートは含まない）
  total_retweets <- tws %>% dplyr::filter(IS_RETWEET == FALSE) %>% select(RETWEET_COUNT) %>% sum() %>% as.numeric()

  # 最も多くメンションされたユーザー トップ10
  mentioned_users_df <- tws %>% select(MENTIONS_SCREEN_NAME) %>% group_by() %>% count(MENTIONS_SCREEN_NAME) %>%
    dplyr::filter(!is.na(MENTIONS_SCREEN_NAME)) %>% rename(FREQ = n) %>% arrange(desc(FREQ)) %>% head(10)
  mentioned_users <- mentioned_users_df$MENTIONS_SCREEN_NAME
  mention_freqs <- mentioned_users_df$FREQ

  metrics <- list(user = user,
                  retweet_ratio = retweet_ratio,
                  total_favs = total_favs,
                  total_retweets = total_retweets,
                  mentioned_users = mentioned_users,
                  mention_freqs = mention_freqs)

  return(metrics)
}
