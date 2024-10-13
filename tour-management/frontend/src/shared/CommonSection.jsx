import React from 'react'
import './common-section.css'

import { Container, Row, Col} from 'reactstrap'

const CommonSection = ({title}) => {
  return (
    <section>
        <Container className="common__section">
            <Row>
                <Col lg='12'>
                    <h1>{title}</h1>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default CommonSection