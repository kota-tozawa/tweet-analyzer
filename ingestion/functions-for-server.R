# 過去に同じユーザー名・ツイート数で既にAPIからデータを取得しているかどうかを判定する関数
did_download_with_same_info <- function(user, ntweets) {
  all_filenames <- list.files("output/raw/rdata/", pattern = "Rdata")
  # 拡張子を除く
  all_filenames <- sub("\\.[^.]*", "", all_filenames)

  # 想定されるファイル名（拡張子 .Rdata 抜き）
  assumed_file_name <- paste0(user, "-", ntweets)

  return(assumed_file_name %in% all_filenames)
}
