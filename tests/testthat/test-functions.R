context("Unit test: extract_dates()")

test_that("正常", {
  actual <- c(as.Date("2020-05-16"), as.Date("2020-11-21"))
  expect_identical(extract_dates(tws), actual)
})

test_that("エラー（不正な引数）", {
  err_msg <- "operator is invalid for atomic vectors"
  expect_error(extract_dates(1), err_msg)
})
