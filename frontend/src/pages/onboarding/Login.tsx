import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import FormControl from "../../components/common/formik/FormControl";
import CommonButton from "../../components/common/ui/commonButton/CommonButton";
import { useAppDispatch } from "../../redux/app/hooks";
import { ROUTES } from "../../constants/routes";
import "./Auth.scss";
import toast from "react-hot-toast";
import { adminLogin } from "../../features/userSlice";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const result = await dispatch(adminLogin(
          {
            email: values.email,
            password: values.password
          }
        )).unwrap();
        console.log(result);
        toast.success(result.message);
        navigate(ROUTES.MARKETPLACE);
      } catch (error: Error | any) {
        toast.error(error);
      }
    },
  });

  const { handleSubmit, errors, touched } = formik;

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h2>Sign In</h2>
        <p>Enter your details to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <FormControl
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            error={touched.email && errors.email ? errors.email : ""}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </div>

        <div className="form-group password-group">
          <FormControl
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            error={touched.password && errors.password ? errors.password : ""}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </div>

        <div className="form-options">
          <Link to="/forgot-password" title="Forgot Password?">
            Forgot Password?
          </Link>
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
      </form>
    </div>
  );
};

export default Login;
