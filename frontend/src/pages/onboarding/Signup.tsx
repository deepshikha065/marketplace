import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import FormControl from '../../components/common/formik/FormControl';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import { ROUTES } from '../../constants/routes';
import { useAppDispatch } from '../../redux/app/hooks';
import toast from 'react-hot-toast';
import { resigterUser } from '../../features/userSlice';
import './Auth.scss';

interface FormValues {  
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().strict(true).required('Full name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      console.log('Sign up values:', values);
      try {
        const result = await dispatch(
          resigterUser({
            name: values.name,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
          })
        ).unwrap();
        console.log(result);
        toast.success(result.message);
        navigate(ROUTES.LOGIN);
      } catch (error: unknown) {
        toast.error(error as string);
      }
    }
  });

  const { handleSubmit, errors, touched } = formik;

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join us and start trading today</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <FormControl
            control="input"
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            error={
              touched.name && errors.name ? errors.name : ''
            }
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="form-group">
          <FormControl
            control="input"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            error={touched.email && errors.email ? errors.email : ''}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <div className="form-group password-group">
            <FormControl
              control="input"
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              error={
                touched.password && errors.password ? errors.password : ''
              }
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="form-group password-group">
            <FormControl
              control="input"
              name="confirmPassword"
              label="Confirm"
              placeholder="Confirm"
              type="password"
              error={
                touched.confirmPassword && errors.confirmPassword
                  ? errors.confirmPassword
                  : ''
              }
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN}>Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
