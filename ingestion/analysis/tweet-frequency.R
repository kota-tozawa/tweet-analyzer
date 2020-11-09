library(dplyr)
library(tidyr)
library(fontregisterer)
library(ggplot2)
library(ggthemes)
library(lubridate)
library(stringr)

# ツイート頻度（回数）の時系列グラフを作成
# 引数にはperiod（期間）を入れる
# TODO 表示可能な最長期間（period = "longest"）、1年（"1year"）、1ヶ月（"1month"）の3つのみ
tweet_freq <- function(user, period) {
  # Rオブジェクトとして保存したツイート情報をロード
  filename <- paste0(user, ".Rdata")
  setwd("./output/raw")
  load(filename)
  setwd("../../")

  # OSに応じた日本語フォントを用意
  family_sans <- get_font()

  tws_cpy <- tws

  # 期間の範囲などを設定
  if (identical(period, "longest")) {
    init_date <- min(tws_cpy$CREATED_AT) %>%
      substr(1, 10) %>%
      as.Date()
    period_desc <- "（表示可能な最長期間）"
  } else if (identical(period, "1year")) {
    init_date <- Sys.Date() - months(12) + 1
    period_desc <- "（1年間）"
  } else if (identical(period, "1month")) {
    init_date <- Sys.Date() - months(1) + 1
    period_desc <- "（1か月間）"
  } else {
    stop("入力可能な期間（period）：\"longest\", \"1year\", \"1month\"のいずれか")
  }
  end_date <- as.Date(Sys.Date(), format = "%Y/%m/%d")
  all_dates <- seq.Date(init_date, end_date, by = "days")
  all_dates_df <- all_dates %>%
    data.frame() %>%
    select(CREATED_AT = 1)

  # ロードしたツイート情報の前処理
  tws_cpy$CREATED_AT <- as.character(tws_cpy$CREATED_AT) %>%
    substr(1, 10) %>%
    ymd()
  tweets_per_day <- tws_cpy %>%
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
  n_tweets <- sum(tweets_per_day_imputed$FREQ)
  n_days <- nrow(tweets_per_day_imputed)
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

  # グラフに表示させる文字を作成
  init_date_char <- gsub("-", "/", as.character(init_date))
  end_date_char <- gsub("-", "/", as.character(end_date)) %>%
    substr(1, 10)
  if (identical(period, "1year")) {
    xlab_min <- min(tweets_per_day_imputed$CREATED_AT)
    xlab_max <- max(tweets_per_day_imputed$CREATED_AT)
    # xlabels <- seq.Date(xlab_min, xlab_max, by = "months")
    xlabels <- seq.Date(xlab_min, xlab_max, by = "months") %>%
      append(as.Date(xlab_max)) %>%
      as.character() %>%
      substr(1, 7) %>%
      paste0("-01") %>%
      as.Date()
  } else if (identical(period, "1month")) {
    xlabels <- all_dates
  }

  # 時系列グラフを作成
  gg <- tweets_per_day_imputed %>%
    ggplot(aes(x = CREATED_AT, y = FREQ)) +
    geom_line(size = 0.2) +
    theme_minimal(base_family = family_sans) +
    # TODO face = "bold"と指定しても，日本語だとフォントが太字（bold）にならないので，サイズをやや大きくし対応
    theme(
      plot.title = element_text(face = "bold", size = 16),
      plot.subtitle = element_text(size = 10),
      plot.caption = element_text(size = 12, colour = "blue")
    ) +
    labs(
      x = NULL, y = "ツイート頻度",
      title = paste0("@", user, " のツイート頻度推移", period_desc),
      subtitle = paste0(init_date_char, " から ", end_date_char, " までの日々のツイート頻度"),
      caption = paste0(
        paste0(init_date_char, " から ", end_date_char, " までの総日数：", n_days, "日\n"),
        paste0(init_date_char, " から ", end_date_char, " までの総ツイート数：", n_tweets, "回\n"),
        paste0("1日当たり平均ツイート頻度：", round(mean_tweets_per_day, digits = 2), "回\n"),
        paste0("1回以上ツイートした日：", gt_one_tws, "日\n"),
        paste0("1回もツイートしなかった日：", zero_tws, "日\n")
      )
    )

  if (identical(period, "1year") || identical(period, "1month")) {
    gg <- gg +
      scale_x_continuous(labels = xlabels, breaks = xlabels) +
      theme(
        axis.text.x = element_text(angle = 90, vjust = 0.5)
      )
  }

  # 時系列グラフを保存
  setwd("./output/images/tweet-frequency/")
  tweet_time_series_png <- paste0("tweet-frequency-", user, "-", period, ".png")
  ggsave(filename = tweet_time_series_png, plot = gg)
  setwd("../../../")
}
