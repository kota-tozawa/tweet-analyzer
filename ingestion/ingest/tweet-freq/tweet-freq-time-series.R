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
  # Rオブジェクトとして保存したツイート情報をロード
  filepath <- paste0("./output/raw/rdata/", user, "-", ntweets, ".Rdata")
  load(filepath)

  # ロードしたツイート情報の前処理
  # ツイート投稿日時をツイート投稿日に変換
  tws <- to_ymd(tws)
  # 日々のツイート頻度を計算
  tweets_per_day <- tws %>%
    select(CREATED_AT) %>%
    group_by() %>%
    count(CREATED_AT) %>%
    rename(FREQ = n)
  # 欠損日のツイート数を0で補間する用のデータフレームを作成
  tmp <- extract_dates(tws)
  init_date <- tmp[1]
  end_date <- tmp[2]
  all_dates <- seq.Date(init_date, end_date, by = "days")
  all_dates_df <- all_dates %>% data.frame() %>% select(CREATED_AT = 1)
  # 欠損日のツイート数を0で補間
  tweets_per_day_imputed <- all_dates_df %>%
    full_join(tweets_per_day, by = "CREATED_AT") %>%
    replace_na(list(FREQ = 0))

  # Rechartsで作る時系列プロット用データを用意
  # TODO 移動平均の時系列プロット用データも用意する（7日間周期でやってみる？）
  breaks <- all_dates
  freqs <- tweets_per_day_imputed$FREQ
  title <- paste0("@", user, " の ", init_date, " から ", end_date, " までのツイート頻度の推移")

  return(list(breaks, freqs, title))
}
