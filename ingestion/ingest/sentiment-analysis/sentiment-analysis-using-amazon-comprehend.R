library(paws)
library(purrr)
library(dplyr)

#' Amazon Comprehend を利用してセンチメント分析を行い、その結果を整形して返す
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
  # Rオブジェクトとして保存したツイートデータをロード
  path <- path_to_tweet_data(user, ntweets)
  load(path)

  # 個々のツイートテキストのリストを抽出
  txts <- create_tweet_texts_dataframe(tws)
  lines <- txts$TEXT

  # batch_detect_sentiment() で処理するために、上記で抽出したリストを、複数の長さ25のリストに分解する
  lines_list <- split_list(lines, 25)

  # Amazon Comprehend サービスを呼び出す
  svc <- comprehend()

  # ガベージコレクション
  gc();gc()

  # 文章のセンチメント（感情）を検出する API を呼び出す。
  # その後、Amazon Comprehend の自然言語処理アルゴリズムにより判定された各ツイートテキストのセンチメントをリストに詰める。
  # センチメントは、算出されたセンチメントスコアに応じて以下の4種類のいずれかに判定される：
  # POSITIVE（肯定的）, NEGATIVE（否定的）, NEUTRAL（中立的）, MIXED（肯定と否定の混在）
  determined_sentiment_list <- list()
  for (lines in lines_list) {
    result <- svc$batch_detect_sentiment(TextList = lines, LanguageCode = "ja")
    result_list <- pluck(result, "ResultList")
    for (result in result_list) {
      determined_sentiment <- pluck(result, "Sentiment")
      determined_sentiment_list <- append(determined_sentiment_list, determined_sentiment)
    }
  }

  # リストの階層を一段階上げる
  determined_sentiment_list <- determined_sentiment_list %>% flatten_chr()

  # 画面表示用タイトル
  title <- paste0("Amazon Comprehend で推定された @", user, " が投稿した", "各ツイートのセンチメント内訳")

  return(list(determined_sentiment_list, title))
}
