import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultPicture from '../images/avatar.png';

class ProfileTabs extends Component {
  render() {
    const { following, followers } = this.props;
    return (
      <div>
        <div className='row'>
          <div className='col-md-6'>
            <div className='dropdown'>
              <button
                className='btn btn-outline-dark dropdown-toggle'
                type='button'
                id='dropdownMenuButton'
                data-mdb-toggle='dropdown'
                aria-expanded='false'
              >
                Followers
              </button>
              <ul
                className='dropdown-menu'
                aria-labelledby='dropdownMenuButton'
              >
                {followers.map((person, i) => (
                  <li key={i} className='dropdown-item'>
                    <div>
                      <Link to={`/user/${person._id}`}>
                        <div className='d-inline-block'>
                          <img
                            style={{
                              borderRadius: '50%',
                              border: '1px solid black',
                            }}
                            className='float-left me-2'
                            height='30px'
                            width='30px'
                            onError={(i) =>
                              (i.target.src = `${DefaultPicture}`)
                            }
                            src={`${process.env.REACT_APP_APU_URL}/user/photo/${person._id}`}
                            alt={person.username}
                          />
                          <p
                            className='lead text-body'
                            style={{ display: 'inline', fontSize: '1rem' }}
                          >
                            {person.username}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <p className='lead text-body text-center ms-4'>
              {followers.length}
            </p>
          </div>
          <div className='col-md-6'>
            <div className='ms-3 dropdown'>
              <button
                className='btn btn-outline-dark dropdown-toggle'
                type='button'
                id='dropdownMenuButton'
                data-mdb-toggle='dropdown'
                aria-expanded='false'
              >
                Following
              </button>
              <ul
                className='dropdown-menu'
                aria-labelledby='dropdownMenuButton'
              >
                {following.map((person, i) => (
                  <li key={i} className='dropdown-item'>
                    <Link to={`/user/${person._id}`}>
                      <img
                        style={{
                          borderRadius: '50%',
                          border: '1px solid black',
                        }}
                        className='float-left me-2'
                        height='30px'
                        width='30px'
                        onError={(i) => (i.target.src = `${DefaultPicture}`)}
                        src={`${process.env.REACT_APP_APU_URL}/user/photo/${person._id}`}
                        alt={person.username}
                      />
                      <p
                        className='lead text-body'
                        style={{ display: 'inline', fontSize: '1rem' }}
                      >
                        {person.username}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className='lead text-body text-center ms-5'>
              {following.length}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
