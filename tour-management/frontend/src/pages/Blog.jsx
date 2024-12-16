import React from 'react'
import {Container} from '@mui/material'
import PostList from '../components/PostList/PostList'
import CommonSection from '../shared/CommonSection'

const Blog = () => {
  return (
    <Container className="blog">
      <CommonSection title={"Blog"}/>
      <PostList/>
    </Container>
  )
}

export default Blog
 
