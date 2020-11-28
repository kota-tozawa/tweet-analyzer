library(shiny)
library(purrr)

server <- function(input, output, session) {
  lineGraphData <- reactive({
    req(input$user) -> user
    req(input$ntweets) -> ntweets

    # 入力されたユーザー名・件数でツイートを取得
    # ただし、画面から入力が submit されるたびに Twitter API にアクセスしてしまうので、同じ数で既に取得している場合は取得をスキップ
    # TODO 同じユーザー名・回数でもう一度ツイートを取得することを希望する場合、例えば、一週間ぶりに使うときに新しいデータに更新したい場合には、それができるようにする
    download_flg <- !did_download_with_same_info(user, ntweets = ntweets)
    if (download_flg) {
      download_user_tweets(user, n_tweets = ntweets)
    }

    tweet_freq_time_series <- visualize_tweet_freq_time_series(user, ntweets = ntweets)
    breaks <- pluck(tweet_freq_time_series, 1)
    freqs <- pluck(tweet_freq_time_series, 2)

    list(
      breaks = breaks,
      freqs = freqs,
      ticks = pretty(breaks)
    )
  })

  observe({
    session$sendCustomMessage("lineGraphData", lineGraphData())
  })
}

ui <- function() {
  htmlTemplate("public/index.html")
}

# ./dist/配下のmain.jsにバンドルする
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}

shinyApp(ui, server)
