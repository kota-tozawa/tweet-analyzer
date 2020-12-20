library(dplyr)
library(tidyr)
library(stringr)
library(lubridate)

#' ツイート頻度の時系列データを抽出・加工する
#'
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 最新のツイートから何ツイート分までを対象とするか
#' \code{tweet_freq_time_series} download_user_tweets()で得たツイートデータから、Rechartsで可視化するために必要な値を取り出して加工し、リストにして返す
#' breaks: 年月日
#' freqs: ツイート頻度
#' summary_statistics: 各種要約統計量の入ったリスト
#' title: 画面表示用グラフタイトル
#' @return list(breaks, freqs, summary_statistics, title)
#' @examples
#' tweet_freq_time_series("Twitter", ntweets = 400)
#' tweet_freq_time_series("Twitter", ntweets = "3200")
tweet_freq_time_series <- function(user, ntweets) {
  ntweets <- parse_numeric(ntweets)

  # Rオブジェクトとして保存したツイートデータをロード
  path <- path_to_tweet_data(user, ntweets)
  load(path)

  # ロードしたツイート情報の前処理
  tws_imputed <- impute_tweets_per_day_with_zero(tws)

  # Rechartsで作る時系列プロット用データを用意
  # TODO 移動平均の時系列プロット用データも用意する（7日間周期でやってみる？）
  breaks <- tws_imputed$CREATED_AT
  freqs <- tws_imputed$FREQ

  # 1日当たりツイート頻度の要約統計量（合計、最小値、最大値、平均、標準偏差）を得る
  summary_statistics <- tws_imputed %>% summarise(tibble(sum = sum(FREQ), min = min(FREQ), max = max(FREQ), mean = mean(FREQ), sd = sd(FREQ)))
  summary_statistics <- list(sum = summary_statistics$sum, min_freq = summary_statistics$min, max_freq = summary_statistics$max,
                             mean_freq = summary_statistics$mean, sd_freq = summary_statistics$sd)

  # 画面表示用タイトル作成
  tmp <- extract_dates(tws_imputed)
  init_date <- tmp[1]
  end_date <- tmp[2]
  title <- paste0("@", user, " の ", init_date, " から ", end_date, " までのツイート頻度の推移")

  return(list(breaks, freqs, summary_statistics, title))
}
