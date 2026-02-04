import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import FormControl from '../../components/common/formik/FormControl';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';

import './Auth.scss';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const handleSubmit = (values: LoginFormValues) => {
    console.log('Login values:', values);
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h2>Sign In</h2>
        <p>Enter your details to access your account</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="auth-form">
            <div className="form-group">
              <FormControl
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                error={touched.email && errors.email ? errors.email : ""}
              />
            </div>

            <div className="form-group password-group">
              <FormControl
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                error={touched.password && errors.password ? errors.password : ""}
              />

            </div>

            <div className="form-options">
              <Link to="/forgot-password" title="Forgot Password?">Forgot Password?</Link>
            </div>

            <CommonButton
              title="Sign In"
              type="submit"
              fluid
              className="submit-btn"
            />

            <div className="auth-footer">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
