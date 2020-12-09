# 取得したツイートデータから最も古いツイートの日付と最も新しいツイートの日付を取り出す関数
extract_dates <- function(tws) {
  if (is.null(tws)) {
    stop(NULL_ARGS_ERR)
  }
  init_date <- min(tws$CREATED_AT)
  end_date <- max(tws$CREATED_AT)

  return(c(init_date, end_date))
}

# ツイートをまとめてひとつのテキストファイルにし、そのテキストファイルへのパスを返す関数
combine_tws_into_txt <- function(tws, user, ntweets) {
  if (is.null(tws) || is.null(user) || is.null(ntweets)) {
    stop(NULL_ARGS_ERR)
  }

  txts <- tws %>%
    select(TEXT) %>%
    mutate(
      # 正規表現によりURLを取り除く
      TEXT = str_remove_all(TEXT, "https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+"),
      # Unicode文字プロパティにより絵文字などを取り除く
      # p{So}: 記号類    p{Cn}: 未定義
      TEXT = str_remove_all(TEXT, "\\p{So}|\\p{Cn}")
    ) %>%
    # TEXTが空のレコードを削除する
    dplyr::filter(TEXT != "")

  # ツイートを1つのテキストファイルに保存
  text_filepath <- paste0("./output/texts/tweets/", user, "-", ntweets, ".txt")
  txts %>%
    pull() %>%
    # 改行を削除する
    str_remove_all("\n") %>%
    write(text_filepath)

  return(text_filepath)
}
