# 厚生労働省の Twitter アカウント
user <- "MHLWitter"
ntweets <- 3200

# テストデータ読み込み（2020/12/04に3200件分取得した厚生労働省のツイートデータ）
# ロードされる変数名：tws
load("../testdata/tws-raw.Rdata")

# テストデータ読み込み（2020/12/04に3200件分取得した厚生労働省のcreated_atカラム前処理済ツイートデータ）
# ロードされる変数名：tws_p
load("../testdata/tws-preprocessed.Rdata")

# エラーメッセージ（ingestion/ingest/constants.R に定義されているものと同様）
NULL_ARGS_ERR <- "必要な引数のうちのいずれか、または全てが NULL です。"
