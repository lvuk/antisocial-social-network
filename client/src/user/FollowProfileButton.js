import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';

class FollowProfileButton extends Component {
  followClick = () => {
    this.props.onButtonClick(follow);
  };

  unfollowClick = () => {
    this.props.onButtonClick(unfollow);
  };

  render() {
    return (
      <div className='d-inline-block '>
        {!this.props.following ? (
          <button
            onClick={this.followClick}
            className='btn btn-warning btn-raised me-5 '
          >
            Follow
          </button>
        ) : (
          <button
            className='btn btn-outline-warning btn-raised'
            onClick={this.unfollowClick}
          >
            Unfollow
          </button>
        )}
      </div>
    );
  }
}

export default FollowProfileButton;
