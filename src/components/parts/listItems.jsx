import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Dashboard, ShowChart, BarChart, Cloud } from '@material-ui/icons';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <Dashboard />
      </ListItemIcon>
      <ListItemText primary="ダッシュボード" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShowChart />
      </ListItemIcon>
      <ListItemText primary="ツイート頻度の時系列グラフ" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChart />
      </ListItemIcon>
      <ListItemText primary="ツイート頻度の度数分布表" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Cloud />
      </ListItemIcon>
      <ListItemText primary="ワードクラウド" />
    </ListItem>
  </div>
);
