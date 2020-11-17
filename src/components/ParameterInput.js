import React from 'react'
import { validationSchema } from './validationSchema'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Container,
  Paper,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { SendRounded } from '@material-ui/icons'

export const ParameterInput = () => {
  const classes = useStyles()

  return (
    <Formik
      initialValues={{
        userName: '',
        period: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
    >
      {({ errors, touched }) => (
        <Container style={{ marginTop: '30px' }} maxWidth="sm">
          <Paper className={classes.paper} elevation={3}>
            <Form>
              <Field
                name="userName"
                // label="Twitterユーザー名"
                as={TextField}
                type="text"
                variant="outlined"
                fullWidth
                error={errors.userName && touched.userName}
              />
              <ErrorMessage name="userName">
                {(msg) => (
                  <Typography className={classes.errorMessage}>
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
              <Field
                name="period"
                // label="期間"
                as={Select}
                variant="outlined"
                fullWidth
                error={errors.period && touched.period}
              >
                <MenuItem value="">選択してください</MenuItem>
                <MenuItem value="longest">できるだけ長い期間</MenuItem>
                <MenuItem value="1year">1年</MenuItem>
                <MenuItem value="1month">1か月</MenuItem>
              </Field>
              <ErrorMessage name="period">
                {(msg) => (
                  <Typography className={classes.errorMessage}>
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
              <div className={classes.buttonWrapper}>
                <Button
                  className={classes.interval}
                  variant="contained"
                  color="primary"
                  endIcon={<SendRounded />}
                >
                  OK
                </Button>
              </div>
            </Form>
          </Paper>
        </Container>
      )}
    </Formik>
  )
}

const useStyles = makeStyles({
  interval: {
    marginTop: '20px',
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
  },
})
