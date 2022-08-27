import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultPicture from '../images/avatar.png';

class ProfileTabs extends Component {
  render() {
    const { following, followers } = this.props;
    return (
      <div>
        <div className='row'>
          <div className='col-md-4'>
            <h3 className='text-warning'>Followers</h3>
            <hr />
            {followers.map((person, i) => (
              <div key={i}>
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
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className='col-md-4'>
            <h3 className='text-warning'>Following</h3>
            <hr />
            {following.map((person, i) => (
              <div key={i}>
                <div>
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
                </div>
              </div>
            ))}
          </div>
          <div className='col-md-4'>
            <h3 className='text-warning'>Posts</h3>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
