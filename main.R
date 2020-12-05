# developmentモードでshinyアプリを起動する

options(shiny.port = 3000)
options(shiny.launch.browser = FALSE)
# サーバーサイドの変更でリロード
options(shiny.autoreload = TRUE)
options(shiny.autoreload.pattern = ".*\\.(r|html)$")
# R（Shiny）とJavaScript（React）の間のやり取り（WebSocket）をコンソールに出力
options(shiny.trace = TRUE)

shiny::runApp()
