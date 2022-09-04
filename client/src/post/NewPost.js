import React, { Component } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { isAuthenticated } from '../auth';
import { create, lastPostByUser } from './apiPost';

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      post: '',
      photos: '',
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
    console.log(this.state.lastPost);

    const userTimezone = dayjs.tz.guess();
    // console.log(userTimezone);

    const postCreatedUserTimezone = dayjs(postCreated, userTimezone);
    // console.log(postCreatedUserTimezone);

    const localStartOfDay = dayjs().local().startOf('day');
    // console.log(localStartOfDay);

    const localEndOfDay = dayjs().local().endOf('day');
    // console.log(localEndOfDay);

    if (
      postCreatedUserTimezone >= localStartOfDay &&
      postCreatedUserTimezone <= localEndOfDay
    ) {
      this.setState({
        isEligibleToPost: false,
      });
    }

    // console.log(this.state.lastPost);
    // console.log(this.state.lastPost.created);
    // console.log(createdDate);
  };

  isValid = () => {
    const { post, fileSize, isEligibleToPost } = this.state;
    console.log(this.state.isEligibleToPost);

    if (!isEligibleToPost) {
      this.setState({
        error: 'You can post only once a day',
        loading: false,
      });
      return false;
    }
    if (fileSize >= 300000) {
      this.setState({
        error: 'File size should be less than 300KB',
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
    return true;
  };

  handleChange = (state) => (event) => {
    this.setState({ error: '' });
    const value =
      state === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = state === 'photo' ? event.target.files[0].size : 0;
    this.postData.set(state, value);
    this.setState({ [state]: value, fileSize });
  };

  clickCreate = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      //send to backend
      create(userId, token, this.postData).then((data) => {
        if (data.error)
          this.setState({ error: data.error, loading: false, post: '' });
        else {
          this.setState({
            loading: false,
            post: '',
            photo: '',
            isPosted: true,
          });
        }
      });
    }
  };

  createForm = (post) => {
    return (
      <form action='' method='post'>
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
            onChange={this.handleChange('photo')}
            type='file'
            className='form-control'
            accept='image/*'
          />
        </div>

        <div className='d-inline-block'></div>
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
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-outline-danger'
                  data-mdb-dismiss='modal'
                >
                  Close
                </button>
                <button
                  onClick={this.clickCreate}
                  className='btn btn-raised btn-primary'
                  data-mdb-dismiss='modal'
                  aria-label='Close'
                >
                  Post
                </button>
              </div>
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
