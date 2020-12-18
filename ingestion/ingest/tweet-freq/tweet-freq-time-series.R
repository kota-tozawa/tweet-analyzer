library(dplyr)
library(tidyr)
library(lubridate)
library(ggplot2)

#' ツイート頻度の時系列データを抽出・加工する
#'
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 最新のツイートから何ツイート分までを対象とするか
#' \code{tweet_freq_time_series} download_user_tweets()で得たツイートデータから、Rechartsで可視化するために必要な値を取り出して加工し、リストにして返す
#' breaks: 年月日
#' freqs: ツイート頻度
#' title: 画面表示用グラフタイトル
#' @return list(breaks, freqs, title)
#' @examples
#' tweet_freq_time_series("Twitter", ntweets = 400)
#' tweet_freq_time_series("Twitter", ntweets = "3200")
tweet_freq_time_series <- function(user, ntweets) {
  # Rオブジェクトとして保存したツイートデータをロード
  path <- path_to_tweet_data(user, ntweets)
  load(path)

  # ロードしたツイート情報の前処理
  tweets_per_day_imputed <- impute_tweets_per_day_with_zero(tws)

  # 画面表示用の期間を抽出
  tmp <- extract_dates(tweets_per_day_imputed)
  init_date <- tmp[1]
  end_date <- tmp[2]

  # Rechartsで作る時系列プロット用データを用意
  # TODO 移動平均の時系列プロット用データも用意する（7日間周期でやってみる？）
  breaks <- tweets_per_day_imputed$CREATED_AT
  freqs <- tweets_per_day_imputed$FREQ
  title <- paste0("@", user, " の ", init_date, " から ", end_date, " までのツイート頻度の推移")

  return(list(breaks, freqs, title))
}
