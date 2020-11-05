# ggplot2などのための日本語フォントを用意
# TODO fontregisterer::get_standard_font()がうまく機能しないので，関数の中身を少し改変してもってくることで対処
get_font <- function() {
  if (Sys.info()["sysname"] == "Windows") {
    if (as.integer(str_extract(Sys.info()["release"], "^[0-9]+")) >= 8) {
      family_sans <- "Yu Gothic"
      # family_serif <- "Yu Mincho"
    } else {
      family_sans <- "MS Gothic"
      # family_serif <- "MS Mincho"
    }
  } else if (Sys.info()["sysname"] == "Linux") {
    family_sans <- "Noto Sans CJK JP"
    # family_serif <- "Noto Serif CJK JP"
  } else if (Sys.info()["sysname"] == "Darwin") {
    family_sans <- "Hiragino Sans"
    # family_serif <- "Hiragino Mincho ProN"
  } else {
    family_sans <- "Noto Sans CJK JP"
    # family_serif <- "Noto Serif CJK JP"
  }

  return(family_sans)
}
