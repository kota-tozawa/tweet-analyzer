library(dplyr)
library(tidyr)
library(lubridate)
library(ggplot2)

#' ツイート頻度の時系列データ取得
#'
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' \code{visualize_tweet_freq_time_series} download_user_tweets()で得たツイートデータから、Rechartsで可視化するために必要な値を取り出して加工し、リストに詰めて返す
#' breaks: 年月
#' freqs: ツイート頻度
#' mertics: ツイート数合計や平均などの各種統計量・メトリクス（下記の5つ）が入ったリスト
#' total_days: プロット期間内の総日数
#' total_tweets: プロット期間内の総ツイート数
#' meatotal_tweets_per_day: 1日当たり平均ツイート頻度
#' gt_one_tws: 1回以上ツイートした日
#' zero_tweets: 1回もツイートしなかった日
#' @return list(breaks, freqs, metrics)
#' @examples
#' visualize_tweet_freq_time_series("Twitter")
visualize_tweet_freq_time_series <- function(user) {
  # Rオブジェクトとして保存したツイート情報をロード
  filepath <- paste0("./output/raw/rdata/", user, ".Rdata")
  load(filepath)

  # ロードしたツイート情報の前処理
  # CREATED_ATをyyyy-mm-dd形式のcharacterに変換
  tws$CREATED_AT <- as.character(tws$CREATED_AT) %>%
    substr(1, 10) %>%
    ymd()
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
  all_dates_df <- all_dates %>%
    data.frame() %>%
    select(CREATED_AT = 1)
  # 欠損日のツイート数を0で補間
  tweets_per_day_imputed <- all_dates_df %>%
    full_join(tweets_per_day, by = "CREATED_AT") %>%
    replace_na(list(FREQ = 0))

  # Rechartsで作る時系列グラフ用データを用意
  # TODO 移動平均の時系列グラフ用データも用意する（7日間周期でやってみる？）
  breaks <- all_dates
  freqs <- tweets_per_day_imputed$FREQ

  return(list(breaks, freqs))
}

# TODO 度数分布表のヒストグラムをRechartsで出すためのデータを用意する関数を作る
# visualize_tweet_freq_histogram <- function(user) {}
