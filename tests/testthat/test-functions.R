context("Unit test: extract_dates()")

test_that("正常", {
  expected <- c(as.Date("2020-06-05"), as.Date("2020-12-04"))
  actual <- extract_dates(tws_p)
  expect_identical(expected, actual)
})

test_that("エラー（不正な引数）", {
  err_msg <- "operator is invalid for atomic vectors"
  expect_error(extract_dates(1), err_msg)
})

test_that("エラー（引数がNULL）", {
  err_msg <- NULL_ARGS_ERR
  expect_error(extract_dates(NULL), err_msg)
})

context("Unit test: combine_tws_into_txt()")

# TODO テキストファイルの保存場所が原因でテストできない。通常実行する時とテスト時でワーキングディレクトリが異なる。
# test_that("正常", {
#   expected <- "./output/texts/tweets/MHLWitter-3200.txt"
#   actual <- combine_tws_into_txt(tws, user = user, ntweets = ntweets)
#   expect_identical(expected, actual)
# })

test_that("エラー（不正な引数）", {
  err_msg <- "引数 \"user\" がありませんし、省略時既定値もありません"
  expect_error(combine_tws_into_txt(1), err_msg)
})

test_that("エラー（引数がNULL）", {
  err_msg <- NULL_ARGS_ERR
  expect_error(combine_tws_into_txt(NULL, user = user, ntweets = ntweets), err_msg)
})
