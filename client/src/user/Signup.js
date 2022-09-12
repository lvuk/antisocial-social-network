import React, { Component } from 'react';
import { signup } from '../auth';
import { Link } from 'react-router-dom';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      error: '',
      open: false,
    };
  }

  handleChange = (state) => (event) => {
    this.setState({ [state]: event.target.value });
    this.setState({ error: '' });
  };

  clickSignup = (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const user = {
      username,
      email,
      password,
    };

    //send to backend
    signup(user).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          username: '',
          email: '',
          password: '',
          error: '',
          open: true,
        });
    });
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
          onClick={this.clickSignup}
          className='btn btn-raised btn-outline-primary mt-3'
        >
          Sign up
        </button>
      </form>
    );
  };

  render() {
    const { username, email, password, error, open } = this.state;
    return (
      <div className='container w-75'>
        <h2 className='mt-5 mb-5'>Signup</h2>

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        <div
          className='alert alert-success'
          style={{ display: open ? '' : 'none' }}
        >
          New account is successfully created. <Link to='/signin'>Sign In</Link>
        </div>

        {this.signupForm(username, email, password)}
      </div>
    );
  }
}

export default Signup;
