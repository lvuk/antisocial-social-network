import React, { Component } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { isAuthenticated } from '../auth';
import { create, lastPostByUser } from './apiPost';
// import cloudinary from '../utils/cloudinary';
// import cloudinary from 'cloudinary';

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      post: '',
      files: [],
      photos: [],
      error: '',
      user: {},
      fileSize: 0,
      loading: false,
      isPosted: false,
      lastPost: {},
      isEligibleToPost: true,
    };
  }

  async componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    await lastPostByUser(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // console.log(data);
        this.setState({ lastPost: data[0] });
        // console.log(this.state.lastPost);
      }
    });
    this.checkPostsToday();
  }

  checkPostsToday = () => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const postCreated = new Date(this.state.lastPost.created);

    const userTimezone = dayjs.tz.guess();

    const postCreatedUserTimezone = dayjs(postCreated, userTimezone);

    const localStartOfDay = dayjs().local().startOf('day');

    const localEndOfDay = dayjs().local().endOf('day');

    if (
      postCreatedUserTimezone >= localStartOfDay &&
      postCreatedUserTimezone <= localEndOfDay
    ) {
      this.setState({
        isEligibleToPost: false,
      });
    }
  };

  isValid = () => {
    const { post, isEligibleToPost, files } = this.state;

    if (files.length > 3) {
      this.setState({ error: 'Only 3 photos are allowed', loading: false });
      return false;
    }
    if (!isEligibleToPost) {
      this.setState({
        error: 'You can post only once a day',
        loading: false,
      });
      return false;
    }
    if (post.length === 0) {
      this.setState({
        error: 'Post cant be empty',
        loading: false,
      });
      return false;
    }
    if (post.length > 365) {
      this.setState({
        error: 'Post can contain maximum of 365 characters',
        loading: false,
      });
      return false;
    }
    return true;
  };

  handleChange = (state) => (event) => {
    this.setState({ error: '' });
    // console.log(event.target.files);

    if (state === 'photos') {
      const files = event.target.files;
      console.log(files);
      for (let index = 0; index < files.length; index++) {
        this.state.files.push(files[index]);
        this.setImageToState(files[index]);
      }
    } else {
      const value = event.target.value;
      this.setState({ [state]: value });
    }
    console.log(this.state);
  };

  setImageToState = (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      this.state.photos.push(reader.result);
    };
    console.log(this.state);
  };

  clickCreate = async (event) => {
    // console.log(this.state);
    event.preventDefault();
    this.setState({ loading: true });

    // console.log(event.target.photos.value);

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      //send photo to cloudinary and save urls in state
      console.log(this.state.files);

      console.log(this.state);
      const postData = { post: this.state.post, photos: this.state.photos };

      const data = await create(userId, token, postData);
      if (data.error)
        this.setState({ error: data.error, loading: false, post: '' });
      else {
        this.setState({
          loading: false,
          files: [],
          post: '',
          photos: [],
          isPosted: true,
        });
      }

      // console.log(this.state);
    }
  };

  createForm = (post) => {
    return (
      <form onSubmit={this.clickCreate}>
        <div className='form-group'>
          <textarea
            onChange={this.handleChange('post')}
            className='form-control'
            maxLength='365'
            value={post}
            style={{ resize: 'none', whiteSpace: 'pre' }}
          />
        </div>

        <div className='form-group'>
          <input
            onChange={this.handleChange('photos')}
            type='file'
            className='form-control'
            accept='image/*'
            name='photos'
            multiple
          />
        </div>

        <div className='d-inline-block mt-3'>
          <button
            type='submit'
            className='btn btn-raised btn-primary'
            data-mdb-dismiss='modal'
            aria-label='Close'
          >
            Post
          </button>
          <button
            type='button'
            className='btn btn-outline-danger ms-3'
            data-mdb-dismiss='modal'
          >
            Close
          </button>
        </div>
      </form>
    );
  };

  createPostModal = (post) => {
    return (
      <div>
        <button
          type='button'
          className='btn btn-primary'
          data-mdb-toggle='modal'
          data-mdb-target='#postModal'
        >
          Create post
        </button>
        <div
          className='modal fade'
          id='postModal'
          tabIndex='-1'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Create a new post
                </h5>
                <button
                  type='button'
                  className='btn-close'
                  data-mdb-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
              <div className='modal-body'>{this.createForm(post)}</div>
              <div className='modal-footer'></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { post, error, loading, isPosted } = this.state;

    return (
      <div className='container'>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          ''
        )}
        {error ? (
          <div className='alert alert-danger alert-dismissible fade show mt-3'>
            {error}{' '}
            <button
              type='button'
              className='btn-close'
              data-mdb-dismiss='alert'
              aria-label='Close'
            ></button>
          </div>
        ) : (
          ''
        )}

        {isPosted ? (
          <div className='alert alert-success mt-3  alert-dismissible fade show '>
            Successfully posted!
            <button
              type='button'
              className='btn-close'
              data-mdb-dismiss='alert'
              aria-label='Close'
              onClick={window.location.reload()}
            ></button>
          </div>
        ) : (
          <div className='invisible'></div>
        )}
        {this.createPostModal(post)}
      </div>
    );
  }
}

export default NewPost;
