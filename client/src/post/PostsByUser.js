import React, { Component } from 'react';
import { postsByUser } from './apiPost';
import DefaultPicture from '../images/avatar.png';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import CarouselPhoto from './CarouselPhoto';

class PostsByUser extends Component {
  componentDidMount = () => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    postsByUser(userId, token).then((data) => {
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
          console.log(post);

          return (
            <div className='card col-md-8 mx-auto mb-5' key={i}>
              <div className='card-body'>
                <div className='d-inline'>
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
                  <Link
                    to={`/user/${posterId}`}
                    className='lead text-body d-inline'
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
                </div>
                <hr />
                <div className='text-center'>
                  {post.photoUrls ? <CarouselPhoto post={post} /> : ''}
                </div>

                <p className='card-body '>{post.post.substring(0, 200)}</p>
                <hr />
                <Link
                  to={`/post/${post._id}`}
                  className='btn btn-outline-primary btn-sm me-3'
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
    const { posts } = this.props;

    return <div className='container'>{this.renderPosts(posts)}</div>;
  }
}

export default PostsByUser;
