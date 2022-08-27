import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import DefaultPicture from '../images/avatar.png';
import DeleteUser from './DeleteUser';

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      username: '',
      email: '',
      password: '',
      redirectToProfile: false,
      error: '',
      loading: false,
      fileSize: 0,
      about: '',
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          username: data.username,
          email: data.email,
          error: '',
          about: data.about,
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { username, email, password, fileSize } = this.state;
    if (username.length === 0) {
      this.setState({ error: 'Username is requried', loading: false });
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      this.setState({ error: 'Email is not valid', loading: false });
      return false;
    }
    if (password.length >= 1 && password.length < 5) {
      this.setState({
        error: 'Password must be at least 6 characters long',
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

    return true;
  };

  handleChange = (state) => (event) => {
    this.setState({ error: '' });
    const value =
      state === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = state === 'photo' ? event.target.files[0].size : 0;
    this.userData.set(state, value);
    this.setState({ [state]: value, fileSize });
  };

  clickUpdate = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      //send to backend
      update(userId, token, this.userData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
      });
    }
  };

  signupForm = (username, email, password, about, id) => {
    return (
      <form action='' method='post'>
        <div className='form-group'>
          <label className='text-muted'>Profile Photo</label>
          <input
            onChange={this.handleChange('photo')}
            type='file'
            className='form-control'
            accept='image/*'
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>Username</label>
          <input
            onChange={this.handleChange('username')}
            type='text'
            className='form-control'
            value={username}
          />
        </div>
        <div className='form-group'>
          <label className='text-muted'>About</label>
          <textarea
            onChange={this.handleChange('about')}
            type='text'
            className='form-control'
            value={about}
          />
        </div>
        <div className='form-group'>
          <label className='text-muted'>Email</label>
          <input
            onChange={this.handleChange('email')}
            type='email'
            className='form-control'
            value={email}
          />
        </div>

        <div className='form-group'>
          <label className='text-muted'>Password</label>
          <input
            onChange={this.handleChange('password')}
            type='password'
            className='form-control'
            value={password}
          />
        </div>
        <div className='d-inline-block'>
          <button
            onClick={this.clickUpdate}
            className='btn btn-raised btn-outline-success btn-rounded mt-3 me-5'
          >
            Update
          </button>
        </div>
      </form>
    );
  };

  render() {
    const {
      id,
      username,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about,
    } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultPicture;

    return (
      <div className='container'>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          ''
        )}
        <h2 className='mt-5 mb-5'>EDIT PROFILE</h2>

        <img
          src={photoUrl}
          onError={(i) => (i.target.src = `${DefaultPicture}`)}
          alt={username}
          style={{ height: '200px', width: '100' }}
          className='img-thumbnail'
        />
        <div
          className='alert alert-danger mt-3'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        {this.signupForm(username, email, password, about, id)}
        <div className='mt-3'>
          <DeleteUser userId={id} />
        </div>
      </div>
    );
  }
}

export default EditProfile;
