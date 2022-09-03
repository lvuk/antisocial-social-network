import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { comment, uncomment } from './apiPost';
import DefaultPicture from '../images/avatar.png';
import { Link } from 'react-router-dom';

class Comment extends Component {
  state = {
    text: '',
    error: '',
  };

  handleChange = (event) => {
    this.setState({ error: '' });
    this.setState({ text: event.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    console.log(text);
    if (text.length <= 0) {
      this.setState({ error: "Comment can't be empty!" });
      return false;
    }
    if (text.length > 365) {
      this.setState({ error: 'Comment can be 365 characters max!' });
      return false;
    }
    return true;
  };

  addComment = (event) => {
    event.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: 'Please signin to comment' });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;
      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          // pass comment to parent
          this.props.updateComments(data.comments);
          this.setState({ text: '' });
        }
      });
    } else {
    }
  };

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirm = (comment) => {
    let answer = window.confirm(
      'Are you sure you want to delete your comment?'
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;
    const reversedComments = [...comments].reverse();

    return (
      <div>
        <div
          className='alert alert-danger mt-3'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>
        <form onSubmit={this.addComment}>
          <div className='form-group mt-2 d-inline'>
            <input
              type='text'
              onChange={this.handleChange}
              className='form-control d-inline-block'
              placeholder='Write a comment'
              style={{ width: '75%' }}
              value={this.state.text}
            />

            <button
              type='submit'
              className='btn btn-raised btn-outline-primary mt-2 d-inline-block'
              style={{ textAlign: 'right', marginLeft: '3rem' }}
            >
              Post
            </button>
          </div>
        </form>

        {reversedComments.map((comment, i) => (
          <div key={i} className='mb-2'>
            <hr />
            <Link to={`/user/${comment.postedBy._id}`}>
              <img
                style={{
                  borderRadius: '50%',
                  border: '1px solid black',
                }}
                className='float-left me-2'
                height='30px'
                width='30px'
                onError={(i) => (i.target.src = `${DefaultPicture}`)}
                src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                alt={comment.postedBy.username}
              />
              <p
                className='lead text-body'
                style={{ display: 'inline', fontSize: '1rem' }}
              >
                <strong>{comment.postedBy.username} </strong>
              </p>
            </Link>
            <p
              className='lead text-body'
              style={{
                display: 'block',
                fontSize: '1rem',
                marginLeft: '35px',
                marginRight: '2rem',
              }}
            >
              {comment.text}
            </p>

            {isAuthenticated().user &&
              isAuthenticated().user._id === comment.postedBy._id && (
                <div
                  style={{
                    textAlign: 'right',
                    marginTop: '-2.8rem',
                  }}
                >
                  <span
                    onClick={() => this.deleteConfirm(comment)}
                    className='float-right text-danger'
                  >
                    <i className='fa-regular fa-trash-can'></i>
                  </span>
                </div>
              )}
          </div>
        ))}
      </div>
    );
  }
}

export default Comment;
