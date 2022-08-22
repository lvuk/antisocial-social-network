import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read, update } from './apiUser';

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
        });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { username, email, password } = this.state;
    if (username.length === 0) {
      this.setState({ error: 'Username is requried' });
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      this.setState({ error: 'Email is not valid' });
      return false;
    }
    if (password.length >= 1 && password.length < 5) {
      this.setState({ error: 'Password must be at least 6 characters long' });
      return false;
    }
    return true;
  };

  handleChange = (state) => (event) => {
    this.setState({ [state]: event.target.value });
  };

  clickUpdate = (event) => {
    event.preventDefault();
    if (this.isValid()) {
      const { username, email, password } = this.state;
      const user = {
        username,
        email,
        password: password || undefined,
      };

      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      //send to backend
      update(userId, token, user).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          this.setState({
            redirectToProfile: true,
          });
      });
    }
  };

  signupForm = (username, email, password) => {
    return (
      <form action='' method='post'>
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
        <button
          onClick={this.clickUpdate}
          className='btn btn-raised btn-outline-warning btn-rounded mt-3'
        >
          Update
        </button>
      </form>
    );
  };

  render() {
    const { id, username, email, password, redirectToProfile, error } =
      this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    return (
      <div className='container'>
        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>
        <h2 className='mt-5 mb-5'>EDIT PROFILE</h2>
        {this.signupForm(username, email, password)}
      </div>
    );
  }
}

export default EditProfile;
