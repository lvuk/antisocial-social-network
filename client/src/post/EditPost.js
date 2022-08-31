import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { singlePost } from './apiPost';
import { update } from './apiPost';
import DeletePost from './DeletePost';
import DefaultPicture from '../images/avatar.png';
import { Link } from 'react-router-dom';

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      post: '',
      redirectToProfile: false,
      error: '',
      fileSize: 0,
      loading: false,
      img: false,
      created: '',
    };
  }

  init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          post: data.post,
          error: '',
          created: data.created,
        });
      }
    });
  };

  checkPhoto = (postId) => {
    singlePost(postId).then((data) => {
      if (data.photo) {
        this.setState({ img: true });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
    this.checkPhoto(postId);
  }

  handleChange = (state) => (event) => {
    this.setState({ error: '' });
    const value =
      state === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = state === 'photo' ? event.target.files[0].size : 0;
    this.postData.set(state, value);
    this.setState({ [state]: value, fileSize });
  };

  clickUpdate = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;
      //send to backend
      update(postId, token, this.postData).then((data) => {
        if (data.error)
          this.setState({ error: data.error, loading: false, post: '' });
        else {
          this.setState({
            loading: false,
            post: '',
            photo: '',
            redirectToProfile: true,
          });
        }
      });
    }
  };

  isValid = () => {
    const { post, fileSize } = this.state;

    if (fileSize >= 300000) {
      this.setState({
        error: 'File size should be less than 300KB',
        loading: false,
      });
      return false;
    }
    if (post.length === 0) {
      this.setState({ error: 'All fields are required', loading: false });
      return false;
    }
    return true;
  };

  updateForm = (post) => {
    return (
      <div className='row'>
        <div className='col-lg-4 col-md-10 mt-5 mx-auto'>
          <form>
            <div className='form-group'>
              <textarea
                onChange={this.handleChange('post')}
                type='text'
                className='form-control'
                value={post}
                style={{
                  whiteSpace: 'pre',
                }}
              />
            </div>
            <br />

            <div className='form-group'>
              <input
                onChange={this.handleChange('photo')}
                type='file'
                className='form-control'
                accept='image/*'
              />
            </div>

            <div className='d-inline-block'>
              <br />
              <button
                onClick={this.clickUpdate}
                className='btn btn-raised btn-outline-primary btn-md'
              >
                Update
              </button>
              <div className='d-inline ms-3'>
                <DeletePost postId={this.state.id} />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToProfile, id, img, error } = this.state;
    const posterId = isAuthenticated().user._id;
    const posterUsername = isAuthenticated().user.username;

    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    return (
      <div>
        <div className='row'>
          <div className='card col-sm-9 mx-auto mt-5'>
            <div className='card-body'>
              <div
                className='alert alert-danger mt-3'
                style={{ display: error ? '' : 'none' }}
              >
                {error}
              </div>
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
                    {new Date(this.state.created).toDateString()}
                  </p>
                </Link>
              </div>
              <hr />
              {img ? (
                <div className='text-center'>
                  <img
                    src={`${
                      process.env.REACT_APP_API_URL
                    }/post/photo/${id}?${new Date().getTime()}`}
                    alt='post'
                    className='img-fluid mt-4 text-center '
                    style={{ display: 'inline-block' }}
                  />
                </div>
              ) : (
                ''
              )}

              {this.updateForm(post)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
