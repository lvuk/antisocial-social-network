import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { remove } from './apiPost';
import { Redirect } from 'react-router-dom';

class DeletePost extends Component {
  state = {
    redirect: false,
  };

  deletePost = () => {
    const token = isAuthenticated().token;
    const postId = this.props.postId;
    console.log(postId);
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        //redirect
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirm = () => {
    let answer = window.confirm('Are you sure you want to delete your post?');
    if (answer) {
      this.deletePost();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }
    return (
      <button
        className='btn btn-raised btn-danger btn-sm'
        onClick={this.deleteConfirm}
      >
        Delete
      </button>
    );
  }
}

export default DeletePost;
