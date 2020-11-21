server <- function(input, output, session) {
  lineGraphData <- reactive({
    req(input$user)
    req(input$period)
    # TODO .Rdata ファイルがなければ自動で取得するようにする（ツイートがとって来れなければエラーを返す）．また最新のツイートデータを任意で取得できるようにする
    # download_user_tweets(input$user)
    tweetFreq <- tweet_freq(input$user, period = input$period)
    breaks = pluck(tweetFreq, 1)
    freqs = pluck(tweetFreq, 2)
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
