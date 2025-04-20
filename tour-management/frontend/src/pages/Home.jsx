import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import home1 from '../assets/images/home/home1.jpg'
import home2 from '../assets/images/home/home2.jpg'
import home3 from '../assets/images/home/home3.jpg'

import Subtitle from '../shared/Subtitle'
import SearchBar from './../shared/SearchBar'
import FeaturedTourList from '../components/Featured-tours/FeaturedTourList'
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery'
import Testimonials from '../components/Testimonial/Testimonials'
import { Grid, Box, Typography } from '@mui/material'
const Home = () => {
  return (
    <>

      {/* banner */}
      <section>
        <Container sx={{ mt: 5 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Box>
                <Box display="flex" alignItems="center" mb={2} sx={{ fontFamily: 'Mulish' }}>
                </Box>
                <Typography variant="h3" fontWeight={700} sx={{ fontFamily: 'Volkhov' }}>
                  Explore the World. Connect the
                  <Box component="span" sx={{ color: 'var(--secondary-color)' }}> Journey!</Box>
                </Typography>
                <Typography variant="body1" mt={2} sx={{ fontSize: '1.1rem', fontFamily: 'Mulish', color: '#555' }}>
                  From hidden gems to iconic destinations, we help you plan seamless adventures with personalized tours,
                  trusted reviews, and expert travel tips. Your dream trip starts here!
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Grid container spacing={2} sx={{ height: 400 }}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      height: '100%',
                    }}
                  >
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={home2}
                        alt="Hero"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={home1}
                        alt="Herosss"
                        sx={{
                          width: '100%',
                          height: '70%',
                          objectFit: 'cover',
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box
                    sx={{
                      height: '70%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 5, // padding toàn bộ, hoặc dùng ml / mr nếu muốn lệch về 1 bên
                    }}
                  >
                    <Box
                      component="img"
                      src={home3}
                      alt="Hero Right"
                      sx={{
                        width: '100%',
                        height: '80%',
                        objectFit: 'cover',
                        borderRadius: 2,
                        maxWidth: '95%', // ảnh nhỏ hơn 1 chút
                        boxShadow: 3
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Search Bar */}
            <Grid item xs={12} mt={4}>
              <SearchBar />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* featured tour */}
      <section>
        <Container>
          <Row>
            <Col lg='12' className="mb-5">
              <Subtitle subtitle={"Explore"} />
              <h2 className='featured__tour-title'>Our featured tours</h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>

      </section>

      {/* gallary */}
      <section>
        <Container>
          <Row>
            <Col lg='12'>
              <Subtitle subtitle={'Gallery'} />
              <h2 className='gallery__title'>Our tour gallary

              </h2>
            </Col>
            <Col lg='12'>
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>


      {/* testimonial */}

      <section>
        <Container>
          <Row>
            <Col lg='12'>
              <Subtitle subtitle={'Fans Love'} />
              <h2 className="testimonial__title">
                Blogs
              </h2>
            </Col>

            <Col lg='12'>
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Home