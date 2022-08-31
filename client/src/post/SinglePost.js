import React, { Component } from 'react';
import { like, singlePost, unlike } from './apiPost';
import DefaultPicture from '../images/avatar.png';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';

class SinglePost extends Component {
  state = {
    post: '',
    like: false,
    likes: 0,
    redirectToSignin: false,
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
        });
      }
    });
  };

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ like: !this.state.like, likes: data.likes.length });
      }
    });
  };

  renderPost = (post) => {
    console.log(post);
    const posterId = post.creator ? `${post.creator._id}` : '';
    const posterUsername = post.creator ? post.creator.username : 'Unknown';

    const { like, likes, redirectToSignin } = this.state;

    if (redirectToSignin) {
      return <Redirect to='/signin' />;
    }

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
            <div className='d-inline-block' onClick={this.likeToggle}>
              {likes}{' '}
              {!like ? (
                <i class='fa-regular fa-heart'></i>
              ) : (
                <i class='fa-solid fa-heart'></i>
              )}
            </div>
            <div className='d-inline-block ms-3'>
              {isAuthenticated().user &&
                isAuthenticated().user._id === post.creator._id && (
                  <div>
                    <Link
                      to={`/post/edit/${post._id}`}
                      className='btn btn-raised btn-primary btn-sm '
                    >
                      Edit
                    </Link>
                  </div>
                )}
            </div>
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
