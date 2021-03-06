# 過去に同じユーザー名・ツイート数で既に API からデータを取得しているかどうかを判定する関数
did_download_with_same_info <- function(user, ntweets) {
  # 拡張子抜きのファイル名を取得する
  all_filenames <- list.files("output/raw/rdata/", pattern = "Rdata") %>% str_remove("\\.[^.]*")

  # 想定されるファイル名
  assumed_file_name <- paste0(user, "-", ntweets)

  return(assumed_file_name %in% all_filenames)
}


# Twitter API から取得したツイートデータをロードする関数
path_to_tweet_data <- function(user, ntweets) {
  path <- paste0("./output/raw/rdata/", user, "-", ntweets, ".Rdata")

  return(path)
}


# 取得したツイートデータから最も古いツイートの日付と最も新しいツイートの日付を取り出す関数
extract_dates <- function(tws) {
  if (is.null(tws)) {
    stop(NULL_ARGS_ERR)
  }
  init_date <- min(tws$CREATED_AT)
  end_date <- max(tws$CREATED_AT)

  return(c(init_date, end_date))
}


# 個々のツイート内容のテキストと投稿日時をデータフレームにまとめる関数
create_tweet_texts_dataframe <- function(tws) {
  if (is.null(tws)) {
    stop(NULL_ARGS_ERR)
  }

  txts <- tws %>%
    select(TEXT, CREATED_AT) %>%
    mutate(
      # 正規表現によりURLを取り除く
      TEXT = str_remove_all(TEXT, "https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+"),
      # Unicode文字プロパティにより絵文字などを取り除く（p{So}: 記号類    p{Cn}: 未定義）
      TEXT = str_remove_all(TEXT, "\\p{So}|\\p{Cn}"),
      # ハッシュタグの削除
      TEXT = str_remove_all(TEXT, "#\\S+"),
      # メンションタグの削除
      TEXT = str_remove_all(TEXT, "@\\S+"),
      # 改行を削除する
      TEXT = str_remove_all(TEXT, "\n"),
      # 半角・全角スペースとタブを取り除く
      TEXT = str_remove_all(TEXT, "[[:space:]]"),
      # カギかっこを取り除く
      TEXT = str_remove_all(TEXT, "「|」")
    ) %>%
    # TEXTが空のレコードを削除する
    dplyr::filter(TEXT != "")

  return(txts)
}


# ツイートをまとめてひとつのテキストファイルにし、そのテキストファイルへのパスを返す関数
combine_tws_into_txt <- function(tws, user, ntweets) {
  if (is.null(tws) || is.null(user) || is.null(ntweets)) {
    stop(NULL_ARGS_ERR)
  }

  # 個々のツイートをデータフレームにまとめる
  txts <- create_tweet_texts_dataframe(tws)

  # ツイートを1つのテキストファイルに保存
  textfile_path <- paste0("./output/texts/tweets/", user, "-", ntweets, ".txt")
  txts %>%
    select(TEXT) %>%
    pull() %>%
    # 改行を削除する
    str_remove_all("\n") %>%
    write(textfile_path)

  return(textfile_path)
}


# 文ごとに形態素解析にかけて結果をデータフレームにする関数
rmecabc <- function(id, sentence) {
  x <- unlist(RMeCabC(sentence, 1))
  tibble(ID = id, TERM = x)
}


# CREATED_AT（ツイート投稿日時）を yyyy-mm-dd 形式に変換する関数
to_ymd <- function(tws) {
  tws$CREATED_AT <- tws$CREATED_AT %>% as.character() %>% substr(1, 10) %>% ymd()

  return(tws)
}


# CREATED_AT（ツイート投稿日時）を yyyy-mm-dd hh:mm:ss 形式の character に変換する関数
to_str_ymdhms <- function(tws) {
  tws$CREATED_AT <- tws$CREATED_AT %>% as.character()

  return(tws)
}


# 1つのリストを一定の長さの複数のリストに分け、分割されたリストを1つのリストに詰めて返す関数
split_list <- function(list, len) {
  return(split(list, ceiling(seq_along(list) / len)))
}


# 欠損日のツイート数を0で補間する関数
impute_tweets_per_day_with_zero <- function(tws) {
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
  all_dates_df <- all_dates %>% tibble() %>% select(CREATED_AT = 1)
  # 欠損日のツイート数を0で補間
  tweets_per_day_imputed <- all_dates_df %>%
    full_join(tweets_per_day, by = "CREATED_AT") %>%
    replace_na(list(FREQ = 0))

  return(tweets_per_day_imputed)
}


# カンマ入りのcharacter型の数字のカンマを除去し、numeric型に変換する関数
# 数値を引数にとった場合はそのまま返す
parse_numeric <- function(value) {
  value <- value %>% as.character() %>% str_remove_all(",") %>% as.numeric()

  return(value)
}
