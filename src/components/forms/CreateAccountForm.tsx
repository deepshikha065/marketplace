import { useFormik } from "formik";
import * as Yup from "yup";
import { Col, Form, Row } from "react-bootstrap";
import InputField from "../common/formik/inputField/InputField";
import SelectField from "../common/formik/selectField/SelectField";
import DatePickerr from "../common/formik/datepickerr/DatePickerr";
import CommonButton from "../common/ui/commonButton/CommonButton";
import "./CreateAccountForm.scss";

const CreateAccountForm = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    role: Yup.string().required("Role is required"),
    dob: Yup.date().nullable().required("Date of Birth is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
      dob: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Values:", values);
      alert(JSON.stringify(values, null, 2));
    },
  });

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "editor", label: "Editor" },
  ];

  return (
    <div className="create_account_form">
      <h3>Create Account</h3>
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={6}>
            <InputField
              label="Email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ""
              }
            />
          </Col>
          <Col md={6}>
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : ""
              }
            />
          </Col>
          <Col md={6}>
            <SelectField
              label="Role"
              name="role"
              options={roleOptions}
              value={formik.values.role}
              onChange={(value: any) => formik.setFieldValue("role", value)}
              error={
                formik.touched.role && formik.errors.role
                  ? (formik.errors.role as string)
                  : undefined
              }
            />
          </Col>
          <Col md={6}>
            <DatePickerr
              label="Date of Birth"
              name="dob"
              defaultValue={formik.values.dob}
              onChange={(value: any) => formik.setFieldValue("dob", value)}
              error={
                formik.touched.dob && formik.errors.dob
                  ? (formik.errors.dob as string)
                  : undefined
              }
            />
          </Col>
          <Col xs={12} className="mt-4">
            <CommonButton type="submit" title="Create Account" />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateAccountForm;
