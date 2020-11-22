# 取得したツイートデータから最も古いツイートの日付と最も新しいツイートの日付を取り出す
extract_dates <- function(tws) {
  init_date <- min(tws$CREATED_AT)
  end_date <- max(tws$CREATED_AT)

  return(c(init_date, end_date))
}
