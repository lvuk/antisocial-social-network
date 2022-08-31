import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read } from './apiUser';
import DefaultPicture from '../images/avatar.png';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import PostsByUser from '../post/PostsByUser';
import { postsByUser } from '../post/apiPost';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: '',
      posts: [],
    };
  }

  // check follow
  checkFollow = (user) => {
    const jwt = isAuthenticated();
    const match = user.followers.find((follower) => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = (callApi) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = (userId) => {
    const token = isAuthenticated().token;
    postsByUser(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user, posts } = this.state;
    if (redirectToSignin) {
      return <Redirect to='/signin' />;
    }
    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultPicture;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Profile</h2>
        <div className='row'>
          <div className='col-md-4'>
            <img
              src={photoUrl}
              onError={(i) => (i.target.src = `${DefaultPicture}`)}
              alt={user.username}
              className='img-thumbnail'
              style={{
                height: '200px',
                width: '200px',
                borderRadius: '50%',
                marginLeft: '10%',
              }}
            />
          </div>
          <div className='col-md-4'>
            <div className='lead mt-2'>
              <p className='fw-bolder'>{user.username}</p>
              <p className='fst-italic' style={{ fontSize: '1rem' }}>
                {user.about}
              </p>
              <p style={{ fontSize: '1rem' }}>Email: {user.email}</p>
              <p
                style={{ fontSize: '1rem' }}
                className='fst-italic'
              >{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>
            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className='d-inline-block'>
                <Link
                  className='btn btn-raised btn-outline-success me-1'
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
              </div>
            ) : (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            )}
          </div>
          <div className='col-md-4 mt-5'>
            <ProfileTabs
              followers={user.followers}
              following={user.following}
            />
          </div>
        </div>
        <br />
        <hr />
        <div className='row'>
          <div className='col md-10 mt-5 mx-auto'>
            <PostsByUser posts={posts} />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
