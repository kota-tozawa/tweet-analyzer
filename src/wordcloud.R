library(dplyr)
library(ggplot2)
library(ggthemes)
library(fontregisterer)
library(stringr)
library(RMeCab)
library(ggwordcloud)
library(readr)
library(stopwords)
library(tidytext)
library(purrr)

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

# ツイートのワードクラウド作成
# ツイートから記号・数値を取り除く
txts <- tws %>%
  select(text) %>%
  mutate(
    text = str_remove_all(text, "https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+"),
    text = str_remove_all(text, "\\p{So}|\\p{Cn}")
  )

# すべてのツイートを1つのテキストファイルに保存
setwd("./output/text_data")
textfile <- paste("tweets_", user, ".txt", sep = "")
txts %>%
  pull() %>%
  write(textfile)
setwd("../../")

# 上で作成したテキストファイルを対象に形態素解析を実行
setwd("./output/text_data")
txt_df <- docDF(textfile, type = 1)
setwd("../../")

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

# 描画
setwd("./output/text_data")
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
setwd("../../")
