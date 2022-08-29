import React, { Component } from 'react';
import { findPeople } from './apiUser';
import DefaultPicture from '../images/avatar.png';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount = () => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  };

  renderUsers = (users) => {
    return (
      <div className='row'>
        {users.map((user, i) => {
          return (
            <div className='card col-md-4 col-lg-3' key={i}>
              <img
                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                onError={(i) => (i.target.src = `${DefaultPicture}`)}
                alt={user.username}
                style={{
                  height: '100px',
                  width: '100px',
                  borderRadius: '50%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                className='img-thumbnail'
              />
              <div className='card-body'>
                <h5 className='card-title'>{user.username}</h5>
                <p className='card-text'>{user.email}</p>
                <Link
                  to={`/user/${user._id}`}
                  className='btn btn-primary'
                  style={{ marginLeft: 'auto', marginRight: 'auto' }}
                >
                  View Profile
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { users } = this.state;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;
