import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import './Profile.scss';
import { EditIcon, LockIcon } from '../../assets/icons/svg';
import FormControl from '../../components/common/formik/FormControl';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import { ROUTES } from '../../constants/routes';
import { useAppSelector } from '../../redux/app/hooks';

interface ProfileFormValues {
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAppSelector(state => state.user);

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      name: user?.user?.name || '',
      email: user?.user?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Full name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string().required('Phone number is required'),
    }),
    onSubmit: values => {
      console.log('Profile updated:', values);
      setIsEditing(false);
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    dirty,
  } = formik;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="h2">My Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button
                className="edit-toggle-btn"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormControl
                name="name"
                label="Full Name"
                value={values.name}
                disabled={!isEditing}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name ? errors.name : ''}
              />

              <FormControl
                name="email"
                label="Email Address"
                type="email"
                value={values.email}
                disabled={!isEditing}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email ? errors.email : ''}
              />
            </div>

            {isEditing && (
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    formik.resetForm();
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>

                <CommonButton
                  title="Save Changes"
                  type="submit"
                  disabled={!dirty}
                />
              </div>
            )}
          </form>
        </div>

        <div className="security-card profile-card">
          <div className="card-header">
            <h3>Security</h3>
          </div>

          <div className="security-item">
            <div className="item-info">
              <LockIcon />
              <div>
                <h4>Password</h4>
                <p>Change your password to keep your account secure</p>
              </div>
            </div>

            <Link to={ROUTES.CHANGE_PASSWORD} className="action-btn">
              Update Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
