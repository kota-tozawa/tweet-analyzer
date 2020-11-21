# Shinyアプリをdev起動

options(shiny.port = 3000)
options(shiny.launch.browser = FALSE)
# サーバーサイドの変更でリロード
options(shiny.autoreload = TRUE)
options(shiny.autoreload.pattern = ".*\\.(r|html)$")

shiny::runApp()
