library(dplyr)
library(ggplot2)
library(ggthemes)
library(lubridate)
library(fontregisterer)
library(stringr)

# Rオブジェクトとして保存したツイート情報をロード
setwd("./output/tmp_data")
load(filename)
setwd("../../")

# ggplot2用のフォントを用意
# TODO fontregisterer::get_standard_font()がうまく機能しないので，関数の中身をそのままもってくることで対処
if (Sys.info()["sysname"] == "Windows") {
  if (as.integer(str_extract(Sys.info()["release"], "^[0-9]+")) >= 8) {
    family_sans <- "Yu Gothic"
    family_serif <- "Yu Mincho"
  } else {
    family_sans <- "MS Gothic"
    family_serif <- "MS Mincho"
  }
} else if (Sys.info()["sysname"] == "Linux") {
  family_sans <- "Noto Sans CJK JP"
  family_serif <- "Noto Serif CJK JP"
} else if (Sys.info()["sysname"] == "Darwin") {
  family_sans <- "Hiragino Sans"
  family_serif <- "Hiragino Mincho ProN"
} else {
  family_sans <- "Noto Sans CJK JP"
  family_serif <- "Noto Serif CJK JP"
}

# ツイート数の推移を可視化
# 1日に平均何ツイートしているかなどを計算（今日から最大3200ツイート前までの期間）
tws2 <- tws
tws2$created_at <- as.character(tws2$created_at) %>%
  substr(1, 10) %>%
  ymd()
tweets_per_day <- tws2 %>%
  select(created_at) %>%
  group_by() %>%
  count(created_at, sort = TRUE) %>%
  rename(freq = n)

end_date <- Sys.Date()
init_date <- min(tws2$created_at)
all_dates <- seq(init_date, end_date, by = "days")
all_dates_df <- all_dates %>%
  data.frame() %>%
  select(created_at = 1)

tweets_per_day_imputed <- all_dates_df %>%
  full_join(tweets_per_day, by = "created_at")
tweets_per_day_imputed[is.na(tweets_per_day_imputed)] <- 0

# 総ツイート数・総日数・平均ツイート数
n_tweets <- sum(tweets_per_day_imputed$freq)
n_days <- nrow(tweets_per_day_imputed)
mean_tweets_per_day <- n_tweets / n_days
# 1回以上ツイートした日
gt_one_tws <- tweets_per_day_imputed %>%
  select(freq) %>%
  filter(freq != 0) %>%
  nrow()
# 1度もツイートしなかった日
zero_tws <- tweets_per_day_imputed %>%
  select(freq) %>%
  filter(freq == 0) %>%
  nrow()

# ヒストグラムを作成（今日から最大3200ツイート前までの期間）
init_date_char <- gsub("-", "/", as.character(init_date))
end_date_char <- gsub("-", "/", as.character(end_date))
tweets_per_day_imputed %>%
  ggplot(aes(x = created_at, y = freq)) +
  geom_line(size = 0.2) +
  theme_minimal(base_family = family_sans) +
  # TODO face = "bold"と指定しても，日本語だとフォントが太字（bold）にならないので，サイズをやや大きくし対応
  theme(
    plot.title = element_text(face = "bold", size = 16),
    plot.subtitle = element_text(size = 10),
    plot.caption = element_text(size = 12, colour = "blue")
  ) +
  labs(
    x = "年", y = "ツイート頻度",
    title = paste("@", user, " のツイート頻度推移（測定可能な最長期間）", sep = ""),
    subtitle = paste(init_date_char, " から ", end_date_char, " までの日々のツイート頻度"),
    caption = paste(
      paste(init_date_char, " から ", end_date_char, " までの総日数：", n_days, "日\n", sep = ""),
      paste(init_date_char, " から ", end_date_char, " までの総ツイート数：", n_tweets, "回\n", sep = ""),
      paste("1日当たり平均ツイート頻度：", round(mean_tweets_per_day, digits = 2), "回\n", sep = ""),
      paste("1回以上ツイートした日：", gt_one_tws, "日\n", sep = ""),
      paste("1回もツイートしなかった日：", zero_tws, "日\n", sep = ""),
      sep = ""
    )
  )

# 1日に平均何ツイートしているかなどを計算（今日から30日前まで）
tws3 <- tws
tws3$created_at <- as.character(tws3$created_at) %>%
  substr(1, 10) %>%
  ymd()
tweets_per_day_last_m <- tws3 %>%
  select(created_at) %>%
  filter(between(created_at, init_last_month, end_last_month)) %>%
  group_by() %>%
  count(created_at) %>%
  rename(freq = n)

end_last_month <- Sys.Date()
init_last_month <- Sys.Date() - 30
all_dates_bw_month <- seq(init_last_month, end_last_month, by = "days")
all_dates_bw_month_df <- all_dates_bw_month %>%
  data.frame() %>%
  select(created_at = 1)
days_in_last_month <- days_in_month(init_last_month)

tweets_per_day_last_m_imputed <- all_dates_bw_month_df %>%
  full_join(tweets_per_day_last_m, by = "created_at")
tweets_per_day_last_m_imputed[is.na(tweets_per_day_last_m_imputed)] <- 0

mean_tweets_per_day_last_m <- sum(tweets_per_day_last_m_imputed$freq) / nrow(tweets_per_day_last_m_imputed)

# ヒストグラムを書き出す（直近1か月）
tweets_per_day_last_m_imputed %>%
  ggplot(aes(x = all_dates_bw_month, y = freq)) +
  geom_line() +
  scale_x_continuous(labels = all_dates_bw_month, breaks = all_dates_bw_month) +
  theme_minimal(base_family = family_sans) +
  theme(
    plot.title = element_text(face = "bold", size = 16),
    axis.text.x = element_text(angle = 90, vjust = 0.5)
  ) +
  labs(
    x = "日付", y = "頻度",
    title = paste("@", user, " のツイート頻度推移（今日から30日前まで）", sep = ""),
    caption = paste("1日の平均ツイート頻度：",
                    round(mean_tweets_per_day_last_m, digits = 2),
                    sep = "")
  )
