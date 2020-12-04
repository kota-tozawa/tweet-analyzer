library(covr)

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
