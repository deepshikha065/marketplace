import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import './Profile.scss';
import { EditIcon, LockIcon } from '../../assets/icons/svg';
import FormControl from '../../components/common/formik/FormControl';
import CommonButton from '../../components/common/ui/commonButton/CommonButton';
import { ROUTES } from '../../constants/routes';


interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const initialValues = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
  });

  const handleSubmit = (values: ProfileFormValues) => {
    console.log('Profile updated:', values);
    setIsEditing(false);
  };

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
              <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
                <EditIcon />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, dirty }) => (
              <Form className="profile-form">
                <div className="form-grid">
                  <FormControl
                    name="fullName"
                    label="Full Name"
                    disabled={!isEditing}
                    error={touched.fullName && errors.fullName ? errors.fullName : ""}
                  />
                  <FormControl
                    name="email"
                    label="Email Address"
                    type="email"
                    disabled={!isEditing}
                    error={touched.email && errors.email ? errors.email : ""}
                  />
                  <FormControl
                    name="phone"
                    label="Phone Number"
                    disabled={!isEditing}
                    error={touched.phone && errors.phone ? errors.phone : ""}
                  />
                  <FormControl
                    name="location"
                    label="Location"
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
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
              </Form>
            )}
          </Formik>
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
