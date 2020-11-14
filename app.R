server <- function(input, output, session) {
  periodData <- reactive({
    req(input$user)
    req(input$period)
    tweetFreq <- tweet_freq(input$user, period = input$period)
    list(
      breaks = pluck(tweetFreq, 1),
      freq = pluck(tweetFreq, 2),
      ticks = pretty(breaks)
    )
  })

  observe({
    session$sendCustomMessage("periodData", periodData())
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
