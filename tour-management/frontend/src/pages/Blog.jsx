import React from 'react'
import { Container } from '@mui/material'
import PostList from '../components/PostList/PostList'
import CommonSection from '../shared/CommonSection'


import { Field, Form, Formik } from "formik";

import { Chip } from "@mui/material";
import { Done, CloseOutlined } from "@mui/icons-material";
import moment from "moment";

import clsx from "clsx";



const Blog = () => {
  return (
    <>
      <CommonSection title={"Blog"} />

      <div className="d-flex align-items-center" style={{ height: 310 }}>
        <Formik
          initialValues={{
            origin: "",
            destination: "",
            oneWay: false,
            depart: "",
            return: "",
            adults: "",
            child: ""
          }}
          validate={values => {
            const errors = {};
            if (!values.origin) {
              errors.origin = "Required!";
            }
            if (!values.destination) {
              errors.destination = "Required!";
            }
            if (!values.depart) {
              errors.depart = "Required!";
            }
            if (!values.oneWay && !values.return) {
              errors.return = "Required!";
            }
            if (!values.adults && !values.child) {
              errors.adults = "Required!";
              errors.child = "Required!";
            }
            if (!values.adults && values.child) {
              errors.child = "Adults are Required!";
            }
            return errors;
          }}
        // onSubmit={(values, { setStatus, setSubmitting }) => {
        //   console.log("values", values);
        //   // enableLoading();
        //   const getFlight = 0;

        //   getFlight(values)
        //     .then(res => {
        //       setSearched(true);
        //       setFlights(res.data.flights || []);
        //       disableLoading();
        //     })
        //     .catch(e => {
        //       disableLoading();
        //       setSubmitting(false);
        //     });
        // }}
        >
          {({ values, errors, handleSubmit, setFieldValue }) => (
            <Form
              className="kt-form row w-100 align-items-center"
              style={{
                background: "#fff",
                padding: "10px 5px 30px 10px",
                borderRadius: "4px"
              }}
            // onSubmit={handleSubmit}
            >
              <div className="col-12 mb-3">
                <Chip
                  label="One Way"
                  onClick={() => setFieldValue("oneWay", !values.oneWay)}
                  onDelete={() => setFieldValue("oneWay", false)}
                  deleteIcon={values.oneWay ? <Done /> : <CloseOutlined />}
                  variant={values.oneWay ? "default" : "outlined"}
                  size="small"
                  style={{ marginRight: 5 }}
                  color="secondary"
                />
                <Chip
                  label="Two Way"
                  onClick={() => setFieldValue("oneWay", !values.oneWay)}
                  onDelete={() => setFieldValue("oneWay", true)}
                  deleteIcon={!values.oneWay ? <Done /> : <CloseOutlined />}
                  variant={!values.oneWay ? "default" : "outlined"}
                  color="secondary"
                  size="small"
                />
              </div>
              <div className={values.oneWay ? "col-3" : "col-2"}>
                <div>From</div>
                {/* <InputAirports field={"origin"} /> */}
                {/* {formErrorMessage(errors.origin)} */}
              </div>
              <div className={values.oneWay ? "col-3" : "col-2"}>
                <div>To</div>
                {/* <InputAirports field={"destination"} /> */}
                {/* {formErrorMessage(errors.destination)} */}
              </div>
              <div className="col-2">
                <div>Depart</div>
                <Field
                  as={props => (
                    <input
                      type="text"
                      className="form-control"
                      onFocus={e => (e.currentTarget.type = "date")}
                      onBlur={e => (e.currentTarget.type = "text")}
                      {...props}
                    />
                  )}
                  placeholder="Depart Date"
                  name="depart"
                  min={moment(new Date()).format("YYYY-MM-DD")}
                />
                {/* {formErrorMessage(errors.depart)} */}
              </div>
              {!values.oneWay && (
                <div className="col-2">
                  <div>Return</div>
                  <Field
                    as={props => (
                      <input
                        type="text"
                        className="form-control"
                        onFocus={e => (e.currentTarget.type = "date")}
                        onBlur={e => (e.currentTarget.type = "text")}
                        {...props}
                      />
                    )}
                    placeholder="Return Date"
                    name="return"
                    min={moment(values.depart || new Date()).format("YYYY-MM-DD")}
                  />
                  {/* {formErrorMessage(errors.return)} */}
                </div>
              )}

              <div className="col-2">
                <div>Adults</div>
                <Field className="form-control" name="adults" as="select">
                  <option value="">Select</option>
                  {[...Array(9).keys()].map(v => (
                    <option
                      value={v + 1}
                      disabled={
                        v +
                        1 +
                        parseInt(values.adults || 0) +
                        parseInt(values.child || 0) >
                        9
                      }
                    >
                      {v + 1}
                    </option>
                  ))}
                </Field>
                {/* {formErrorMessage(errors.adults)} */}
              </div>
              <div className="col-2">
                <div>Child</div>
                <Field className="form-control" name="child" as="select">
                  <option value="">Select</option>
                  {[...Array(9).keys()].map(v => (
                    <option
                      value={v + 1}
                      disabled={
                        v +
                        1 +
                        parseInt(values.adults || 0) +
                        parseInt(values.child || 0) >
                        9
                      }
                    >
                      {v + 1}
                    </option>
                  ))}
                </Field>
                {/* {formErrorMessage(errors.child)} */}
              </div>

              <div className="col-12 text-right">
                <button
                  className={`btn btn-primary btn-elevate kt-login__btn-primary 
                  // ${clsx(
                      // {
                      //   "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                      // }
                    )}`}
                  // style={loadingButtonStyle}
                  type={"submit"}
                >
                  <i className="fa fa-search" /> Find Offers
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <Container>
        <PostList />
      </Container>

    </>

  )
}

export default Blog

