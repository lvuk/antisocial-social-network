import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { remove } from './apiUser';
import { signout } from '../auth';
import { Redirect } from 'react-router-dom';

class DeletePost extends Component {
  state = {
    redirect: false,
  };

  deletePost = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        //signout user
        signout(() => console.log('User deleted'));
        //redirect
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirm = () => {
    let answer = window.confirm(
      'Are you sure you want to delete your account?'
    );
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
    return (
      <button
        className='btn btn-raised btn-danger btn-rounded'
        onClick={this.deleteConfirm}
      >
        Delete Post
      </button>
    );
  }
}

export default DeletePost;
