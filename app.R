library(shiny)
library(purrr)

server <- function(input, output, session) {
  dataIngested <- reactive({
    # どの分析用のデータを用意すれば良いか判定
    req(input$analysisType) -> analysis_type

    tweet_freq_flg <- analysis_type == "tweetFreq"
    wordcloud_flg <- analysis_type == "wordcloud"
    sentiment_analysis_flg <- analysis_type == "sentimentAnalysis"

    # 画面で入力された Twitter ユーザー名と取得するツイート数を変数に格納
      req(input$user) -> user
      req(input$ntweets) -> ntweets

    # 時系列プロット用のデータを用意
    if (tweet_freq_flg) {
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
      req(input$ntweets2nd) -> ntweets2nd

      download_flg_ntweets <- !did_download_with_same_info(user, ntweets = ntweets)
      download_flg_ntweets2nd <- !did_download_with_same_info(user, ntweets = ntweets2nd)
      if (download_flg_ntweets) {
        download_user_tweets(user, ntweets = ntweets)
      } else if (download_flg_ntweets2nd) {
        download_user_tweets(user, ntweets = ntweets2nd)
      }

      sentiment_polarity_analysis_result <- sentiment_polarity_analysis(user, ntweets = ntweets)
      breaks <- pluck(sentiment_polarity_analysis_result, 1)
      scores <- pluck(sentiment_polarity_analysis_result, 2)
      lengths <- pluck(sentiment_polarity_analysis_result, 3)
      title_polarity <- pluck(sentiment_polarity_analysis_result, 4)

      sentiment_analysis_with_comprehend_result <- sentiment_analysis_with_comprehend(user, ntweets = ntweets2nd)
      determined_sentiment_list <- pluck(sentiment_analysis_with_comprehend_result, 1)
      title_comprehend <- pluck(sentiment_analysis_with_comprehend_result, 2)

      list(
        breaks = breaks,
        scores = scores,
        lengths = lengths,
        title_polarity = title_polarity,
        determined_sentiment_list = determined_sentiment_list,
        title_comprehend = title_comprehend
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
