import React from 'react'
import '../styles/home.css'
import { Container, Row, Col } from 'reactstrap'

import heroImg from '../assets/images/hero-img01.jpg'
import heroImg02 from '../assets/images/hero-img02.jpg'
import heroVideo from '../assets/images/hero-video.mp4'
import worldImg from '../assets/images/world.png'

import Subtitle from '../shared/Subtitle'
import SearchBar from './../shared/SearchBar'
import FeaturedTourList from '../components/Featured-tours/FeaturedTourList'
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery'

const Home = () => {
  return (
    <>

    {/* banner */}
    <section>
      <Container>
        <Row>
          <Col lg='6'>
            <div className='hero__content'>
              <div className="hero__subtitle d-flex align-items-center">
                <Subtitle subtitle={'Know Before You Go'}/>
                  <img src={worldImg} alt="" />
              </div>
              <h1>Traveling opens the door to creating 
                <span className='highlight'> memories</span>
              </h1>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                Adipisci consequuntur vitae, quia vero, soluta laudantium 
                commodi a quod ex reiciendis voluptas debitis ullam. 
                Quam cum deserunt explicabo architecto inventore laborum.
              </p>
            </div>
          </Col>

          <Col lg='2'>
            <div className='hero__img-box'>
              <img src={heroImg} alt="" />
            </div>
          </Col>

          <Col lg='2'>
            <div className='hero__img-box mt-4'>
              <video src={heroVideo} alt="" controls/>
            </div>
          </Col>

          <Col lg='2'>
            <div className='hero__img-box mt-5'>
              <img src={heroImg02} alt="" />
            </div>
          </Col>

          <SearchBar/>
        </Row>
      </Container>
    </section>

    {/* featured tour */}
    <section>
      <Container>
        <Row>
          <Col lg='12' className="mb-5">
            <Subtitle subtitle={"Explore"}/>
            <h2 className='featured__tour-title'>Our featured tours</h2>
          </Col>
          <FeaturedTourList/>
        </Row>
      </Container>
      
    </section>

    {/* gallary */}
    <section>
      <Container>
        <Row>
          <Col lg='12'>
            <Subtitle subtitle={'Gallery'}/>
            <h2 className='gallery__title'>Visit our customer tour gallary
      
            </h2>
          </Col>
          <Col lg='12'>
            <MasonryImagesGallery/>
          </Col>
        </Row>
      </Container>
    </section>


    </>
  )
}

export default Home