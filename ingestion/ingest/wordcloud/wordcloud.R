library(dplyr)
library(stringr)
library(RMeCab)
library(readr)
library(stopwords)

#' 重要な・意味のある頻出単語とその頻度をツイートテキストから抽出する
#' @param user character Twitterユーザー名（先頭にアットマークは付けない）
#' @param ntweets numeric | character 最新のツイートから何ツイート分までを対象とするか
#' \code{wordcloud} download_user_tweets()で得たツイートテキストから、react-wordcloudで可視化するために必要な値を取り出して加工し、リストにして返す
#' words: 単語のリスト
#' freqs: 単語の頻度
#' title: 画面表示用タイトル
#' @return list(words, freqs, title)
#' @examples
#' wordcloud("Twitter", ntweets = 400)
#' wordcloud("Twitter", ntweets = "3200")
wordcloud <- function(user, ntweets) {
  ntweets <- parse_numeric(ntweets)

  # Rオブジェクトとして保存したツイートデータをロード
  path <- path_to_tweet_data(user, ntweets)
  load(path)

  # ツイートをまとめてひとつのテキストファイルにする
  textfile_path <- combine_tws_into_txt(tws, user = user, ntweets = ntweets)

  # ガベージコレクションを実行しメモリを開放
  gc();gc()

  # 上で作成したテキストファイルを対象に形態素解析を実行
  txt_df <- docDF(textfile_path, type = 1)

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
  ja_stop_words <- tmp %>% add_row(TERM = JA_CUSTOM_STOP_WORD_LIST)
  en_stop_words <- stopwords("en", source = "stopwords-iso") %>%
    tibble() %>%
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
