import React, { Component } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

class CarouselPhoto extends Component {
  render() {
    const post = this.props.post;
    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <Slider {...settings}>
        {post.photoUrls.map((imgUrl, i) => {
          return (
            <div key={i}>
              <img
                src={imgUrl}
                alt='smth'
                width='80%'
                height='300px'
                className='text-center mx-auto px-auto'
              />
            </div>
          );
        })}
      </Slider>
    );
  }
}

export default CarouselPhoto;
