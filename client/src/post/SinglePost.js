import React, { Component } from 'react';
import { singlePost } from './apiPost';
import DefaultPicture from '../images/avatar.png';
import { Link } from 'react-router-dom';

class SinglePost extends Component {
  state = {
    post: '',
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ post: data });
      }
    });
  };

  renderPost = (post) => {
    console.log(post);
    const posterId = post.creator ? `/user/${post.creator._id}` : '';
    const posterUsername = post.creator ? post.creator.username : 'Unknown';

    return (
      <div className='row'>
        <div className='card col-md-9 mx-auto mt-5'>
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
            <hr />
            <div className='text-center'>
              {post.photo ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt='Post'
                  className='img-fluid mb-3 text-center'
                />
              ) : (
                ''
              )}
            </div>

            <p className='card-body '>{post.post}</p>
            <hr />
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { post } = this.state;
    return (
      <div>
        {' '}
        {!post ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
      </div>
    );
  }
}

export default SinglePost;
