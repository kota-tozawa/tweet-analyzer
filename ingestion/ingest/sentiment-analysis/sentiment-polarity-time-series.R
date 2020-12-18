library(tidyverse)
library(dplyr)
library(stringr)
library(lubridate)
library(RMeCab)
library(purrr)

#' ツイートの感情極性値時系列データを抽出・加工する
#'
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 最新のツイートから何ツイート分までを対象とするか
#' \code{sentiment_polarity_time_series} download_user_tweets()で得たツイートデータから、Rechartsで可視化するために必要な値を取り出して加工し、リストにして返す
#' breaks: 年月日
#' emotional_scores: 感情極性値のリスト
#' sentence_lengths: 文長のリスト
#' title: 画面表示用グラフタイトル
#' @return list(breaks, emotional_scores, tweet_lengths, title)
#' @examples
#' sentiment_polarity_time_series("Twitter", ntweets = 400)
#' sentiment_polarity_time_series("Twitter", ntweets = "3200")
sentiment_polarity_time_series <- function(user, ntweets) {
  # 辞書の準備
  # 東京工業大学の高村先生が公開されている語感情極性対応表を利用する
  # 極性値が低いほどネガティブ
  dict <- read.table("http://www.lr.pi.titech.ac.jp/~takamura/pubs/pn_ja.dic",
                    sep = ":", stringsAsFactors = FALSE, fileEncoding = "CP932", encoding = "UTF-8")

  # 上記の辞書から単語（TERM）と感情極性値（SCORE）のみを取り出す
  # 同じ単語が複数ある場合、その平均を感情極性値とする
  dict <- dict %>%
    arrange(V1) %>%
    group_by(V1) %>%
    summarize(SCORE = mean(V4)) %>%
    select(TERM = V1, SCORE)

  # Rオブジェクトとして保存したツイートデータをロード
  path <- path_to_tweet_data(user, ntweets)
  load(path)

  # ツイートの並び順を古い順にする（感情極性値の時系列変化を可視化するため）
  tws <- tws %>% arrange(CREATED_AT)
  tws <- to_str_ymdhms(tws)

  # 個々のツイート内容のテキストをデータフレームにまとめる
  txts <- create_tweet_texts_dataframe(tws)

  # ガベージコレクションを実行
  gc();gc()

  # 単語とツイート投稿日がペアになったデータフレームを生成
  terms <- map2_dfr(txts$CREATED_AT, txts$TEXT,
                    ~ rmecabc(..1, ..2))

  # 語感情極性対応表と単語とツイート投稿日がペアになったデータフレームを TERM で結合
  terms <- terms %>% left_join(dict)

  # IDごとにグルーピングし、極性値の合計を求める（極性値がないものは除く）
  ems <- terms %>% group_by(ID) %>% summarise(EM = sum(SCORE, na.rm = TRUE))

  # 極性値の要約統計量を確認
  # ems %>% select(EM) %>% summary()
  # 最もポジティブなツイートを確認（考察：文長が短いと極端な極性値をとる？）
  # ems %>% dplyr::filter(EM == min(EM)) %>% left_join(txts) %>% select(TEXT) %>% pull()

  # 個々のツイート文の長さを求める
  txts <- txts %>% mutate(LENGTH = nchar(TEXT))
  ems <- ems %>% left_join(txts, by = c("ID" = "CREATED_AT"))

  # React で可視化するためにツイート投稿日、極性値、ツイート文長を別々のリストにする
  breaks <- ems$ID
  emotional_scores <- ems$EM
  sentence_lengths <- ems$LENGTH

  # 画面表示用タイトル
  title <- paste0("@", user, " の", "ツイートの感情極性値時系列")

  return(list(breaks, emotional_scores, sentence_lengths, title))
}
