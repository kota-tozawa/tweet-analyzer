# 画面から入力が submit されるたびに Twitter API にアクセスしてしまうので、
# 同じユーザー名・ツイート数で既に取得している場合は取得をスキップする関数
did_download_with_same_info <- function(user, ntweets) {
  all_filenames <- list.files("output/raw/rdata/", pattern = "Rdata")
  all_filenames <- sub("\\.[^.]*", "", all_filenames)
  all_filenames <- sub("_testdata", "", all_filenames)

  # 想定されるファイル名（拡張子 .Rdata 抜き）
  assumed_file_name <- paste0(user, "-", ntweets)

  return(assumed_file_name %in% all_filenames)
}
