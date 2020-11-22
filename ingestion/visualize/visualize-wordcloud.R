library(dplyr)
library(ggplot2)
library(ggthemes)
library(stringr)
library(RMeCab)
library(ggwordcloud)
library(readr)
library(stopwords)
library(tidytext)

# ツイート内容からワードクラウド作成
# Rオブジェクトとして保存したツイート情報をロード
raw_file <- paste0("./output/raw/rdata/", user, ".Rdata")
load(raw_file)

# 日本語フォントを用意
tmp <- get_standard_font()
sans <- tmp[1]

# ツイートから記号・数値を取り除く
txts <- tws %>%
  select(text) %>%
  mutate(
    text = str_remove_all(text, "https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+"),
    text = str_remove_all(text, "\\p{So}|\\p{Cn}")
  )

# すべてのツイートを1つのテキストファイルに保存
tweet_txt <- paste0("./output/texts/tweets/", user, ".txt")
txts %>%
  pull() %>%
  write(tweet_txt)

# 上で作成したテキストファイルを対象に形態素解析を実行
txt_df <- docDF(tweet_txt, type = 1)

# 品詞大分類とその細分類を組み合わせてフィルターにかける
txt_df <- txt_df %>%
  filter(
    POS1 %in% c("名詞", "形容詞", "動詞"),
    POS2 %in% c("一般", "自立", "非自立", "助詞類接続")
  )

# ストップワード設定
tmp <- read_csv(
  "http://svn.sourceforge.jp/svnroot/slothlib/CSharp/Version1/SlothLib/NLP/Filter/StopWord/word/Japanese.txt",
  col_names = "TERM"
)
ja_stop_words <- tmp %>%
  add_row(
    TERM = c("ある", "する", "てる", "いる", "の", "いう", "しまう", "なる")
  )
en_stop_words <- stopwords("en", source = "stopwords-iso") %>%
  data.frame() %>%
  select(TERM = 1)
stop_words <- rbind(ja_stop_words, en_stop_words)

# ワードクラウド作成
txt_df_refined <- txt_df %>%
  select(TERM, FREQ = textfile) %>%
  arrange(FREQ) %>%
  tail(100) %>%
  anti_join(stop_words, by = "TERM")
txt_df_refined %>%
  filter(FREQ > 10) %>%
  ggplot() +
  aes(label = TERM, color = FREQ, size = FREQ) +
  geom_text_wordcloud() +
  scale_size_area(max_size = 20) +
  theme_minimal()

# ワードクラウドを保存
wordcloud_img <- paste0("./output/images/wordcloud/", user, ".png")
ggsave(filename = wordcloud_img, plot = last_plot())

