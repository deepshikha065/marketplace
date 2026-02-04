import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import FormControl from '../../components/common/formik/FormControl';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import './Auth.scss';
import { ROUTES } from '../../constants/routes';

const Signup: React.FC = () => {

  const initialValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = (values: any) => {
    console.log('Signup values:', values);
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join us and start trading today</p>
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
                control="input"
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                error={touched.fullName && errors.fullName ? errors.fullName : ""}
              />
            </div>

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

            <div className="">
              <div className="form-group password-group">
                <FormControl
                  control="input"
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  error={touched.password && errors.password ? errors.password : ""}
                />
              </div>

              <div className="form-group password-group">
                <FormControl
                  control="input"
                  name="confirmPassword"
                  label="Confirm"
                  placeholder="Confirm"
                  type="password"
                  error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""}
                />
              </div>
            </div>
            <CommonButton
              title="Create Account"
              type="submit"
              fluid
              className="submit-btn"
            />

            <div className="auth-footer">
              Already have an account? <Link to={ROUTES.LOGIN}>Sign In</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
