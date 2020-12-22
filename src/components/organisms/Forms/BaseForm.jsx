import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  Button,
  TextField,
  Select,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Container,
  Paper,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';
import { validationSchema } from '../../molecules/validationSchema';

const useStyles = makeStyles({
  interval: {
    marginTop: '16px',
  },
  paper: {
    padding: '24px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  errorMessage: {
    fontSize: '0.8rem',
    color: '#F44036',
    marginTop: '8px',
  },
});

// TODO 画面側だけでなく Shiny サーバーの方もエラーハンドリングするようにする
const BaseForm = ({ analysisType, options }) => {
  const classes = useStyles();

  const setInputValues = (values) => {
    window.Shiny.setInputValue('user', values.user);
    window.Shiny.setInputValue('ntweets', values.ntweets);
    window.Shiny.setInputValue('analysisType', values.analysisType);
    // ブーリアンは JS において true / false で表されるが、R では TRUE / FALSE で表されるので、JS のブーリアンをそのまま R に渡すとうまく動かない。
    // なので文字列（'true' / 'false'）にして渡す。
    window.Shiny.setInputValue(
      'fetchLatestTweets',
      String(values.fetchLatestTweets)
    );
  };

  return (
    <Formik
      initialValues={{
        user: '',
        ntweets: 400,
        analysisType: analysisType,
        fetchLatestTweets: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        // JS to R
        setInputValues(values);
        setSubmitting(false);
      }}
    >
      {({ errors, touched }) => (
        <Container style={{ marginTop: '66px' }} maxWidth="sm">
          <Paper className={classes.paper}>
            <Form>
              <Typography className={classes.interval}>
                Twitterユーザー名（先頭の@は抜きで入力してください）
              </Typography>
              <Field
                name="user"
                as={TextField}
                placeholder="Twitterユーザー名"
                type="text"
                variant="outlined"
                fullWidth
                error={errors.user && touched.user}
              />
              <ErrorMessage name="user">
                {(msg) => (
                  <Typography className={classes.errorMessage}>
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
              <Typography className={classes.interval}>
                取得するツイート数
              </Typography>
              <Field
                name="ntweets"
                as={Select}
                type="select"
                variant="outlined"
                fullWidth
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Field>
              <FormControlLabel
                control={
                  <Field
                    name="fetchLatestTweets"
                    as={Checkbox}
                    type="checkbox"
                  />
                }
                className={classes.interval}
                label="最新のツイートデータを取得する"
              />
              <div className={classes.buttonWrapper}>
                <Button
                  type="submit"
                  className={classes.interval}
                  variant="contained"
                  color="primary"
                  endIcon={<SendRounded />}
                  // エラーが表示されている間はボタンを押せなくする
                  disabled={errors.user ? true : false}
                >
                  Send
                </Button>
              </div>
            </Form>
          </Paper>
        </Container>
      )}
    </Formik>
  );
};

BaseForm.propTypes = {
  analysisType: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BaseForm;
