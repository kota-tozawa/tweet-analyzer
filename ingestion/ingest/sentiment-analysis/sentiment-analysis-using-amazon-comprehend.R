library(paws)
library(purrr)
library(dplyr)

#' ツイートの感情極性値時系列データを抽出・加工する
#'
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 最新のツイートから何ツイート分までを対象とするか
#' \code{sentiment_analysis_with_comprehend} download_user_tweets()で得たツイートデータから、Rechartsで可視化するために必要な値を取り出して加工し、リストにして返す
#' determined_sentiment_list: 各ツイートのセンチメント判定結果のリスト
#' title: 画面表示用グラフタイトル
#' @return list(determined_sentiment_list, title)
#' @examples
#' sentiment_analysis_with_comprehend("Twitter", ntweets = 50)
#' sentiment_analysis_with_comprehend("Twitter", ntweets = "100")
sentiment_analysis_with_comprehend <- function(user, ntweets) {
  # Rオブジェクトとして保存したツイート情報をロード
  filepath <- paste0("./output/raw/rdata/", user, "-", ntweets, ".Rdata")
  load(filepath)

  # 個々のツイート内容のテキストをデータフレームにまとめる
  txts <- create_tweet_texts_dataframe(tws)
  lines <- txts$TEXT

  # Amazon Comprehend サービスを呼び出す
  svc <- comprehend()

  # ガベージコレクション
  gc();gc()

  # 文章からセンチメントを検出する API を呼び出す。
  # その後、Amazon Comprehend の自然言語処理アルゴリズムにより判定された各ツイートテキストのセンチメントをリストに詰める。
  # センチメントは、算出されたセンチメントスコアに応じて以下の4種類のいずれかに判定される：
  # POSITIVE（肯定的）, NEGATIVE（否定的）, NEUTRAL（中立的）, MIXED（肯定と否定の混在）
  determined_sentiment_list <- list()
  for (line in lines) {
    result <- svc$detect_sentiment(Text = line, LanguageCode = "ja")
    determined_sentiment <- result[[1]]
    determined_sentiment_list <- append(determined_sentiment_list, determined_sentiment)
  }

  # リストの階層を一段階上げてあげる
  determined_sentiment_list <- determined_sentiment_list %>% flatten_chr()

  # 画面表示用タイトル
  title <- paste0("Amazon Comprehend で推定された @", user, " が投稿した", "各ツイートのセンチメント")

  return(list(determined_sentiment_list, title))
}
