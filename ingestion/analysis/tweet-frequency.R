library(dplyr)
library(tidyr)
library(ggplot2)
library(lubridate)
library(stringr)
library(purrr)

# ツイート頻度（回数）の時系列グラフ（折れ線グラフ）を作成
# 引数にはuser（Twitterユーザー名）とperiod（期間）を入れる
# TODO 引数として入力可能な期間（period）が、「表示可能な最長期間」、「1年」、「1ヶ月」の3パターンのみ
tweet_freq <- function(user, period) {
  # Rオブジェクトとして保存したツイート情報をロード
  filename <- paste0(user, ".Rdata")
  setwd("./output/raw/rdata")
  load(filename)
  setwd("../../../")

  # 表示対象期間を設定
  if (identical(period, "表示可能な最長期間")) {
    init_date <- min(tws$CREATED_AT) %>%
      substr(1, 10) %>%
      as.Date()
  } else if (identical(period, "1年")) {
    init_date <- Sys.Date() - months(12) + 1
  } else if (identical(period, "1か月")) {
    init_date <- Sys.Date() - months(1) + 1
  } else {
    stop("入力可能な期間（period）：\"表示可能な最長期間\", \"1年\", \"1か月\"のいずれか")
  }
  end_date <- as.Date(Sys.Date(), format = "%Y/%m/%d")
  all_dates <- seq.Date(init_date, end_date, by = "days")
  all_dates_df <- all_dates %>%
    data.frame() %>%
    select(CREATED_AT = 1)

  # ロードしたツイート情報の前処理
  tws$CREATED_AT <- as.character(tws$CREATED_AT) %>%
    substr(1, 10) %>%
    ymd()
  tweets_per_day <- tws %>%
    select(CREATED_AT) %>%
    group_by() %>%
    count(CREATED_AT) %>%
    rename(FREQ = n) %>%
    dplyr::filter(CREATED_AT >= init_date)

  # 欠損日のツイート数を0で補間
  tweets_per_day_imputed <- all_dates_df %>%
    full_join(tweets_per_day, by = "CREATED_AT") %>%
    replace_na(list(FREQ = 0))

  # 総ツイート数・総日数・平均ツイート数を求める
  # TODO 他にもユーザーが見たいと思うようなメトリクス・統計量を算出する
  n_days <- nrow(tweets_per_day_imputed)
  n_tweets <- sum(tweets_per_day_imputed$FREQ)
  mean_tweets_per_day <- mean(tweets_per_day_imputed$FREQ)
  # 1回以上ツイートした日を求める
  gt_one_tws <- tweets_per_day_imputed %>%
    select(FREQ) %>%
    dplyr::filter(FREQ != 0) %>%
    nrow()
  # 1度もツイートしなかった日を求める
  zero_tws <- tweets_per_day_imputed %>%
    select(FREQ) %>%
    dplyr::filter(FREQ == 0) %>%
    nrow()
  # 上記で求めた総ツイート数などのメトリクスをリストに詰める（returnしてこれら値を返すために）
  metrics <- list(n_days, n_tweets, mean_tweets_per_day, gt_one_tws, zero_tws)

  # グラフにラベルなどを作成
  if (identical(period, "1年")) {
    xlab_min <- min(tweets_per_day_imputed$CREATED_AT)
    xlab_max <- max(tweets_per_day_imputed$CREATED_AT)
    xlabels <- seq.Date(xlab_min, xlab_max, by = "months") %>%
      append(as.Date(xlab_max)) %>%
      as.character() %>%
      substr(1, 7) %>%
      paste0("-01") %>%
      as.Date()
  } else if (identical(period, "1か月")) {
    xlabels <- all_dates
  }

  # 時系列グラフを作成
  gg <- tweets_per_day_imputed %>%
    ggplot(aes(x = CREATED_AT, y = FREQ)) +
    geom_line(size = 0.2)

  if (identical(period, "1年") || identical(period, "1か月")) {
    gg <- gg +
      scale_x_continuous(labels = xlabels, breaks = xlabels) +
      theme(
        axis.text.x = element_text(angle = 90, vjust = 0.5)
      )
  }

  # 上で作成したグラフからRechart用に必要な値を取り出す
  ggb <- ggplot_build(gg)
  breaks <- pluck(ggb, "plot", "data", "CREATED_AT")
  freqs <- pluck(ggb, "plot", "data", "FREQ")

  # 下記をリストに詰めてreturn（breaksとfreq以外の値はmetricsリストに詰めている）：
  # breaks（年月），freq（ツイート頻度），n_days（プロット期間内の総日数），
  # n_tweets（プロット期間内の総ツイート数），mean_tweets_per_day（1日当たり平均ツイート頻度），
  # gt_one_tws（1回以上ツイートした日），zero_tweets（1回もツイートしなかった日）
  return(list(breaks, freqs, metrics))
}
