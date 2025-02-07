import React from 'react'
import {Container} from '@mui/material'
import PostList from '../components/PostList/PostList'
import CommonSection from '../shared/CommonSection'

const Blog = () => {
  return (
    <>
      <CommonSection title={"Blog"}/>
      <Container>
         <PostList/>
      </Container>
     
    </>
    
  )
}

export default Blog
 
