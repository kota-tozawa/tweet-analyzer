# Shinyアプリをdev起動

options(shiny.port = 3000)
options(shiny.launch.browser = FALSE)
options(shiny.autoreload = TRUE)
# サーバーサイドの変更でリロード
options(shiny.autoreload.pattern = ".*\\.(r|html)$")

shiny::runApp()
