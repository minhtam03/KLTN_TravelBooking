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



      <Container>
        <PostList />
      </Container>

    </>

  )
}

export default Blog

