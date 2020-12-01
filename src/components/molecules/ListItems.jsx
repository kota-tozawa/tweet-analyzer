import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Dashboard, ShowChart, Cloud } from '@material-ui/icons';

export const MainListItems = (
  <div>
    <ListItem key="Home" component={Link} to="/" button>
      <ListItemIcon>
        <Dashboard />
      </ListItemIcon>
      <ListItemText primary="ホーム画面" />
    </ListItem>
    <ListItem key="TweetFreq" component={Link} to="/tweet-freq" button>
      <ListItemIcon>
        <ShowChart />
      </ListItemIcon>
      <ListItemText primary="ツイート頻度の分析" />
    </ListItem>
    <ListItem key="WordCloud" component={Link} to="/wordcloud" button>
      <ListItemIcon>
        <Cloud />
      </ListItemIcon>
      <ListItemText primary="ワードクラウド" />
    </ListItem>
  </div>
);
