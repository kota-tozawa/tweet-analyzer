# ggplot2などのための日本語フォントを用意
# TODO fontregisterer::get_standard_font()がうまく機能しないので，関数の中身を少し改変してもってくることで対処
get_font <- function() {
  if (Sys.info()["sysname"] == "Windows") {
    if (as.integer(str_extract(Sys.info()["release"], "^[0-9]+")) >= 8) {
      family_sans <- "Yu Gothic"
      # family_serif <- "Yu Mincho"
    } else {
      family_sans <- "MS Gothic"
      # family_serif <- "MS Mincho"
    }
  } else if (Sys.info()["sysname"] == "Linux") {
    family_sans <- "Noto Sans CJK JP"
    # family_serif <- "Noto Serif CJK JP"
  } else if (Sys.info()["sysname"] == "Darwin") {
    family_sans <- "Hiragino Sans"
    # family_serif <- "Hiragino Mincho ProN"
  } else {
    family_sans <- "Noto Sans CJK JP"
    # family_serif <- "Noto Serif CJK JP"
  }

  return(family_sans)
}

# 選択された期間に応じて分析対象期間開始日の日付を返す関数
# ユーザーが 2020/11/20 に「1年」の期間を選択したなら，分析対象期間は 2019/11/20 ~ 2020/11/20
# この「2019/11/20」を算出する
calc_init_date <- function(tws, period) {
  init_date <- NULL

  if (period %in% c("longest", "表示可能な最長期間")) {
    init_date <- min(tws$CREATED_AT) %>%
      substr(1, 10) %>%
      as.Date()
  } else if (period %in% c("1year", "1年")) {
    init_date <- Sys.Date() - months(12) + 1
  } else if (period %in% c("1month", "1か月")) {
    init_date <- Sys.Date() - months(1) + 1
  } else {
    err_msg <- paste0("\n引数 period に入力された値： ",
                      period,
                      "\n引数 period は次の3つうちいずれかの文字列の値をとる必要があります：",
                      "\"longest\", \"1year\", \"1month\", \"表示可能な最長期間\", \"1年\", \"1か月\"")
    stop(err_msg)
  }

  return(init_date)
}
