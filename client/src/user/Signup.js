import React, { Component } from 'react';

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
    this.signup(user).then((data) => {
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

  signup = (user) => {
    return fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
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
          className='btn btn-raised btn-primary mt-3'
        >
          Sign up
        </button>
      </form>
    );
  };

  render() {
    const { username, email, password, error, open } = this.state;
    return (
      <div className='container'>
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
          New account is successfully created. Please sign in.
        </div>

        {this.signupForm(username, email, password)}
      </div>
    );
  }
}

export default Signup;
