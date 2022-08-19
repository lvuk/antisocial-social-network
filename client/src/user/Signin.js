import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToReferer: false,
    };
  }

  handleChange = (state) => (event) => {
    this.setState({ [state]: event.target.value });
    this.setState({ error: '' });
  };

  authenticate = function (jwt, next) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', JSON.stringify(jwt));
      next();
    }
  };

  clickSignin = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };

    //send to backend
    this.signin(user).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        //authenticate
        this.authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
        //redirect
      }
    });
  };

  signin = (user) => {
    return fetch('http://localhost:3000/signin', {
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

  signinForm = (email, password) => {
    return (
      <form action='' method='post'>
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
          onClick={this.clickSignin}
          className='btn btn-raised btn-primary mt-3'
        >
          Sign in
        </button>
      </form>
    );
  };

  render() {
    const { email, password, error, redirectToReferer } = this.state;
    if (redirectToReferer) {
      return <Redirect to='/' />;
    }
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Signin</h2>

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        {this.signinForm(email, password)}
      </div>
    );
  }
}

export default Signin;
