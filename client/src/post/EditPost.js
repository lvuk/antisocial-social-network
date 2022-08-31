import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { singlePost } from './apiPost';
import { update } from './apiPost';

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
        <div className='col-sm-9 mt-5 mx-auto'>
          <form action='' method='post'>
            <div className='form-group'>
              <textarea
                onChange={this.handleChange('post')}
                type='text'
                className='form-control'
                value={post}
                style={{ resize: 'none', whiteSpace: 'pre' }}
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
            </div>
          </form>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToProfile, id, img, error } = this.state;

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
              {img ? (
                <img
                  src={`${
                    process.env.REACT_APP_API_URL
                  }/post/photo/${id}?${new Date().getTime()}`}
                  alt='post'
                  className='img-fluid mb-3 text-center'
                />
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
