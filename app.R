library(shiny)
library(purrr)

server <- function(input, output, session) {
  dataIngested <- reactive({
    # どの分析用のデータを用意すれば良いか判定
    req(input$analysisType) -> analysis_type

    tweet_freq_flg <- analysis_type == "tweetFreq"
    wordcloud_flg <- analysis_type == "wordcloud"
    sentiment_analysis_flg <- analysis_type == "sentimentAnalysis"

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

      tweet_freq_time_series_result <- tweet_freq_time_series(user, ntweets = ntweets)
      breaks <- pluck(tweet_freq_time_series_result, 1)
      freqs <- pluck(tweet_freq_time_series_result, 2)
      title <- pluck(tweet_freq_time_series_result, 3)

      list(
        breaks = breaks,
        freqs = freqs,
        # ticks は年月のデータとなる。使い道は今のところないがとりあえずJS側に渡すようにしている。
        # e.g.: ["2020-01-01", "2020-02-01", "2020-03-01", ...]
        ticks = pretty(breaks),
        title = title
      )
    } else if (wordcloud_flg) {
      # ワードクラウド用のデータを用意
      req(input$user) -> user
      req(input$ntweets) -> ntweets

      download_flg <- !did_download_with_same_info(user, ntweets = ntweets)
      if (download_flg) {
        download_user_tweets(user, ntweets = ntweets)
      }

      wordcloud_result <- wordcloud(user, ntweets = ntweets)
      words <- pluck(wordcloud_result, 1)
      freqs <- pluck(wordcloud_result, 2)
      title <- pluck(wordcloud_result, 3)

      list(
        words = words,
        freqs = freqs,
        title = title
      )
    } else if (sentiment_analysis_flg) {
      # センチメント分析用のデータを用意
      req(input$user) -> user
      req(input$ntweets) -> ntweets

      download_flg <- !did_download_with_same_info(user, ntweets = ntweets)
      if (download_flg) {
        download_user_tweets(user, ntweets = ntweets)
      }

      sentiment_analysis_result <- sentiment_analysis(user, ntweets = ntweets)
      breaks <- pluck(sentiment_analysis_result, 1)
      scores <- pluck(sentiment_analysis_result, 2)
      lengths <- pluck(sentiment_analysis_result, 3)
      title <- pluck(sentiment_analysis_result, 4)

      list(
        breaks = breaks,
        scores = scores,
        lengths = lengths,
        title = title
      )
    }
  })

  observe({
    session$sendCustomMessage("dataIngested", dataIngested())
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
