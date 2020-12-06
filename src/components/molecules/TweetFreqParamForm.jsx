import React from 'react';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Container,
  Paper,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';
import { Options } from '../atoms/constants';

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

const TweetFreqParamForm = () => {
  const classes = useStyles();

  const setInputValues = (values) => {
    window.Shiny.setInputValue('user', values.user);
    window.Shiny.setInputValue('ntweets', values.ntweets);
  };

  return (
    <Formik
      initialValues={{
        user: '',
        ntweets: 400,
      }}
      validationSchema={Yup.object({
        user: Yup.string().required('必須項目です'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setInputValues(values);
        setSubmitting(false);
      }}
    >
      {({ errors, touched }) => (
        <Container style={{ marginTop: '66px' }} maxWidth="sm">
          <Paper className={classes.paper} elevation={3}>
            <Form>
              <Typography className={classes.interval}>
                Twitterユーザー名
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
                {Options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Field>
              <div className={classes.buttonWrapper}>
                <Button
                  type="submit"
                  className={classes.interval}
                  variant="contained"
                  color="primary"
                  endIcon={<SendRounded />}
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

export default TweetFreqParamForm;
