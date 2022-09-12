import React, { Component } from 'react';
import { list } from './apiPost';
import DefaultPicture from '../images/avatar.png';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import CarouselPhoto from './CarouselPhoto';

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentDidMount = () => {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  renderPosts = (posts) => {
    return (
      <div className='row'>
        {posts.map((post, i) => {
          const posterId = post.creator ? post.creator._id : '';
          const posterUsername = post.creator ? post.creator.username : '';

          return (
            <div className='card col-md-9 col-lg-8 mx-auto mb-5' key={i}>
              <div className='card-body'>
                <img
                  style={{
                    borderRadius: '50%',
                    border: '1px solid black',
                  }}
                  className='float-left me-2'
                  height='40px'
                  width='40px'
                  onError={(i) => (i.target.src = `${DefaultPicture}`)}
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                  alt={posterUsername}
                />
                {isAuthenticated() ? (
                  <Link
                    to={`/user/${posterId}`}
                    className='lead text-body'
                    style={{ display: 'inline', fontSize: '1.2rem' }}
                  >
                    {posterUsername}{' '}
                    <p
                      style={{
                        fontSize: '0.8rem',
                        marginLeft: '50px',
                        marginTop: '-10px',
                      }}
                    >
                      {new Date(post.created).toDateString()}
                    </p>
                  </Link>
                ) : (
                  <Link
                    to={'/signin'}
                    className='lead text-body'
                    style={{ display: 'inline', fontSize: '1.2rem' }}
                  >
                    {posterUsername}{' '}
                    <p
                      style={{
                        fontSize: '0.8rem',
                        marginLeft: '50px',
                        marginTop: '-10px',
                      }}
                    >
                      {new Date(post.created).toDateString()}
                    </p>
                  </Link>
                )}
                <hr />
                <div className='text-center'>
                  {post.photoUrls ? <CarouselPhoto post={post} /> : ''}
                </div>

                <p className='card-body '>{post.post.substring(0, 200)}</p>
                <hr />

                <Link
                  to={`/post/${post._id}`}
                  className='btn btn-outline-primary'
                >
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>News feed</h2>
        {this.renderPosts(posts)}
      </div>
    );
  }
}

export default Posts;
