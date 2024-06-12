import React from 'react';

import { ListItemText } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const display = (props) => {
  const { time, title, content } = props;
  const testContant = [
    [
      ['What is the color of the sky?', ['Blue', 'Green', 'Purple', 'Orange']],
      ['Which of these is not a prime number?', ['11', '13', '15', '17']],
    ],
  ];
  const listRender = testContant.map((i) => {
    let qid = 0;
    let oid = 0; // question and option
    const option = (options) => {
      options.map((j) => {
        const op = (
          <ListItem key={oid}>
            <ListItemText primary={j} />
          </ListItem>
        );
        oid += 1;
        return op;
      });
    };

    const item = (
      <ListItem key={qid}>
        <ListItemText
          primary={
            <>
              <title>{i[0]}</title>
              <List>{option(i[1])}</List>
            </>
          }
        />
      </ListItem>
    );
    qid += 1;
    return item;
  });

  return (
    <>
      <time>{time}</time>
      <title>{title}</title>
      <div>
        <title>{title}</title>
        <List>{listRender}</List>
      </div>
    </>
  );
};

export default display;
