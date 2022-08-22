import React, { Component } from 'react';
import { list } from './apiUser';
import DefaultPicture from '../images/avatar.png';
import { Link } from 'react-router-dom';

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount = () => {
    list().then((data) => {
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
                src={DefaultPicture}
                className='card-img-top'
                alt='User Profile'
              />
              <div className='card-body'>
                <h5 className='card-title'>{user.username}</h5>
                <p className='card-text'>{user.email}</p>
                <Link to={`/user/${user._id}`} className='btn btn-warning'>
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

export default Users;