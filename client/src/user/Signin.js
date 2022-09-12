import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { signin, authenticate } from '../auth';

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToReferer: false,
      loading: false,
    };
  }

  handleChange = (state) => (event) => {
    this.setState({ [state]: event.target.value });
    this.setState({ error: '' });
  };

  clickSignin = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };
    //send to backend
    signin(user).then((data) => {
      console.log(data);
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        //authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
        //redirect
      }
    });
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
          className='btn btn-raised btn-primary  mt-3'
        >
          Sign in
        </button>
      </form>
    );
  };

  render() {
    const { email, password, error, redirectToReferer, loading } = this.state;
    if (redirectToReferer) {
      return <Redirect to='/' />;
    }
    return (
      <div className='container w-75'>
        <h2 className='mt-5 mb-5'>Signin</h2>

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          ''
        )}

        {this.signinForm(email, password)}
      </div>
    );
  }
}

export default Signin;
