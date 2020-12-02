import React, { useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import clsx from 'clsx';
import {
  makeStyles,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
  List,
} from '@material-ui/core';
import { Menu, ChevronLeft } from '@material-ui/icons';
import { MainListItems } from './components/molecules/ListItems';
import Home from './components/pages/Home';
import TweetFreq from './components/pages/TweetFreq';
import WordCloud from './components/pages/WordCloud';
import SentimentAnalysis from './components/pages/SentimentAnalysis';

const drawerWidth = 240;

// TODO FCかもしくはCCに書き方を統一する
// Appコンポーネントは関数コンポーネントじゃないと上手く表示がいかない...
// 逆にTweatFreqコンポーネントはクラスコンポーネントで書かないと値が送られずグラフが描画されない...
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // サイドバーの下に画面が隠れないように下記を設定
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const App = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            ツイート分析用ダッシュボード
          </Typography>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </div>
          <Divider />
          <List>{MainListItems}</List>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/tweet-freq" component={TweetFreq} exact />
            <Route path="/wordcloud" component={WordCloud} exact />
            <Route
              path="/sentiment-analysis"
              component={SentimentAnalysis}
              exact
            />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default App;
