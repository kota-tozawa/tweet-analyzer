library(shiny)
library(purrr)

server <- function(input, output, session) {
  lineGraphData <- reactive({
    req(input$user)
    req(input$ntweets)

    # TODO 入力がsubmitされるたびにTwitter APIにアクセスしてしまう
    # download_user_tweets(input$user, n_tweets = input$ntweets)

    tweetFreqTimeSeries <- visualize_tweet_freq_time_series(input$user)
    breaks <- pluck(tweetFreqTimeSeries, 1)
    freqs <- pluck(tweetFreqTimeSeries, 2)

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
