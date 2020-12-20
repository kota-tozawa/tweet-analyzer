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
const FormForSentimentAnalysis = ({ analysisType, options, options2nd }) => {
  const classes = useStyles();

  const setInputValues = (values) => {
    window.Shiny.setInputValue('user', values.user);
    window.Shiny.setInputValue('ntweets', values.ntweets);
    window.Shiny.setInputValue('ntweets2nd', values.ntweets2nd);
    window.Shiny.setInputValue('analysisType', values.analysisType);
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
        ntweets2nd: 200,
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
              <Typography component={'span'} className={classes.interval}>
                <pre>
                  取得するツイート数：感情極性対応表を用いた感情極性値時系列
                </pre>
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
              <Typography component={'span'} className={classes.interval}>
                <pre>取得するツイート数：自然言語処理を用いた感情分類</pre>
              </Typography>
              <Field
                name="ntweets2nd"
                as={Select}
                type="select"
                variant="outlined"
                fullWidth
              >
                {options2nd.map((option) => (
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
                  disabled={errors.user}
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

FormForSentimentAnalysis.propTypes = {
  analysisType: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  options2nd: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default FormForSentimentAnalysis;
