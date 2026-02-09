import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import FormControl from '../../components/common/formik/FormControl';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import { ArrowLeftIcon } from '../../assets/icons/svg';
import './ForgotPassword.scss';
import { ROUTES } from '../../constants/routes';

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const handleSubmit = (values: ForgotPasswordFormValues) => {
    console.log('Forgot password values:', values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="forgot-password-page success">
        <div className="status-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 4 12 14.01 9 11.01" />
            <path d="M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <h2>Check your email</h2>
        <p>We've sent a password reset link to your email address.</p>
        <CommonButton
          title="Back to Sign In"
          to="/login"
          role="link"
          fluid
          className="back-btn"
        />
        <div className="resend">
          Didn't receive the email? <button onClick={() => setSubmitted(false)}>Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-header">
        <Link to={ROUTES.LOGIN} className="back-link">
          <ArrowLeftIcon /> Back to Sign In
        </Link>
        <h2>Forgot Password?</h2>
        <p>No worries, we'll send you reset instructions.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="forgot-form">
            <div className="form-group">
              <FormControl
                control="input"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                error={touched.email && errors.email ? errors.email : ""}
              />
            </div>

            <CommonButton
              title="Reset Password"
              type="submit"
              fluid
              className="submit-btn"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;
