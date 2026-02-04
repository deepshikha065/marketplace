import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FormControl from '../components/common/formik/FormControl';
import CommonButton from '../components/common/ui/commonButton/CommonButton';
import { ArrowLeftIcon } from '../assets/icons/svg';
import { ROUTES } from '../constants/routes';
import './ChangePassword.scss';
interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = (values: ChangePasswordFormValues) => {
    console.log('Password changed:', values);
    navigate(ROUTES.PROFILE);
  };

  return (
    <div className="change-password-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
          <span>Back to Profile</span>
        </button>
        <h1 className="h2">Change Password</h1>
        <p>Your new password must be different from previous passwords.</p>
      </div>

      <div className="change-password-card">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="change-password-form">
              <FormControl
                name="currentPassword"
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                error={touched.currentPassword && errors.currentPassword ? errors.currentPassword : ""}
              />

              <FormControl
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter new password"
                error={touched.newPassword && errors.newPassword ? errors.newPassword : ""}
              />

              <FormControl
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""}
              />

              <div className="form-actions">
                <CommonButton
                  title="Update Password"
                  type="submit"
                  fluid
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
