library(dplyr)
library(stringr)
library(RMeCab)
library(readr)
library(stopwords)

#' 重要な・意味のある頻出単語とその頻度をツイートテキストから抽出する
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 最新のツイートから何ツイート分までを対象とするか
#' \code{visualize_wordcloud} download_user_tweets()で得たツイートテキストから、react-wordcloudで可視化するために必要な値を取り出して加工し、リストに詰めて返す
#' breaks: 年月日
#' freqs: ツイート頻度
#' title: 画面表示用タイトル
#' @return list(breaks, freqs, title)
#' @examples
#' visualize_wordcloud("Twitter", ntweets = 400)
#' visualize_wordcloud("Twitter", ntweets = "3200")
visualize_wordcloud <- function(user, ntweets) {
  # Rオブジェクトとして保存したツイート情報をロード
  filepath <- paste0("./output/raw/rdata/", user, "-", ntweets, ".Rdata")
  load(filepath)

  # ツイートからワードクラウドに不必要な文字列を取り除く
  txts <- tws %>%
    select(TEXT) %>%
    mutate(
      # 正規表現によりURLを取り除く
      TEXT = str_remove_all(TEXT, "https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+"),
      # Unicode文字プロパティにより絵文字などを取り除く
      # p{So}: 記号類    p{Cn}: 未定義
      TEXT = str_remove_all(TEXT, "\\p{So}|\\p{Cn}")
    )

  # ツイートを1つのテキストファイルに保存
  text_filepath <- paste0("./output/texts/tweets/", user, "-", ntweets, ".txt")
  txts %>%
    pull() %>%
    write(text_filepath)

  # 上で作成したテキストファイルを対象に形態素解析を実行
  txt_df <- docDF(text_filepath, type = 1)

  # 品詞大分類とその細分類を組み合わせてフィルターにかける
  txt_df <- txt_df %>%
    dplyr::filter(
      POS1 %in% c("名詞", "形容詞", "動詞"),
      POS2 %in% c("一般", "自立", "非自立", "助詞類接続")
    )

  # ストップワードのデータフレーム作成
  tmp <- read_csv(
    "http://svn.sourceforge.jp/svnroot/slothlib/CSharp/Version1/SlothLib/NLP/Filter/StopWord/word/Japanese.txt",
    col_names = "TERM"
  )
  ja_stop_words <- tmp %>%
    add_row(TERM = JA_CUSTOM_STOP_WORD_LIST)
  en_stop_words <- stopwords("en", source = "stopwords-iso") %>%
    data.frame() %>%
    select(TERM = 1) %>%
    add_row(TERM = EN_CUSTOM_STOP_WORD_LIST)
  stop_words <- rbind(ja_stop_words, en_stop_words)

  # データ作成（頻出150単語とその出現頻度の組み合わせ）
  txt_df_refined <- txt_df %>%
    select(TERM, FREQ = 4) %>%
    arrange(desc(FREQ)) %>%
    head(150) %>%
    anti_join(stop_words, by = "TERM")
  # 単語と出現頻度をそれぞれ別のリストに分ける
  words <- txt_df_refined$TERM
  freqs <- txt_df_refined$FREQ
  title <- paste0("@", user, " の", "ツイート文中の頻出語から生成されたワードクラウド")

  return(list(words, freqs, title))
}
