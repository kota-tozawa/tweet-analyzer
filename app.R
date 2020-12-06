library(shiny)
library(purrr)

server <- function(input, output, session) {
  lineGraphData <- reactive({
    # どの分析用のデータを用意すれば良いか判定
    recent_tweets_flg <- req(input$analysisType) == "recentTweets"
    tweet_freq_flg <- req(input$analysisType) == "tweetFreq"
    wordcloud_flg <- req(input$analysisType) == "wordcloud"
    sentiment_analysis_flg <- req(input$analysisType) == "sentimentAnalysis"

    # 時系列グラフ用のデータを用意
    if (tweet_freq_flg) {
      req(input$user) -> user
      req(input$ntweets) -> ntweets

      # 入力されたユーザー名・件数でツイートを取得
      # ただし、画面から入力が submit されるたびに Twitter API にアクセスしてしまうので、同じ数で既に取得している場合は取得をスキップ
      # TODO 同じユーザー名・回数でもう一度ツイートを取得することを希望する場合、例えば、一週間ぶりに使うときに新しいデータに更新したい場合には、それができるようにする
      download_flg <- !did_download_with_same_info(user, ntweets = ntweets)
      if (download_flg) {
        download_user_tweets(user, ntweets = ntweets)
      }

      tweet_freq_time_series <- visualize_tweet_freq_time_series(user, ntweets = ntweets)
      breaks <- pluck(tweet_freq_time_series, 1)
      freqs <- pluck(tweet_freq_time_series, 2)
      title <- pluck(tweet_freq_time_series, 3)

      list(
        breaks = breaks,
        freqs = freqs,
        ticks = pretty(breaks),
        title = title
      )
    }
    # ワードクラウド用のデータを用意
    # if (wordcloud_flg) {
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
