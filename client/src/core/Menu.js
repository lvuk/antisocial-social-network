import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth';

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: '#FFAB40' };
  else return { color: '#757575' };
};

const Menu = ({ history }) => (
  //   <div>
  //     <Link to='/'>Home</Link>
  //     <Link to='/signin'>Sign in</Link>
  //     <Link to='/signup'>Sign up</Link>
  //   </div>
  <div>
    <ul className='nav nav-tabs bg-light'>
      <li className='nav-item'>
        <Link to='/' className='nav-link' style={isActive(history, '/')}>
          Home
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          to='/users'
          className='nav-link'
          style={isActive(history, '/users')}
        >
          Users
        </Link>
      </li>
      {!isAuthenticated() && (
        <div className='d-flex ms-auto'>
          <li className='nav-item'>
            <Link
              to='/signin'
              className='nav-link'
              style={isActive(history, '/signin')}
            >
              Sign in
            </Link>
          </li>
          <li className='nav-item '>
            <Link
              to='/signup'
              className='nav-link'
              style={isActive(history, '/signup')}
            >
              Sign up
            </Link>
          </li>
        </div>
      )}

      {isAuthenticated() && (
        <div className=' ms-auto'>
          <li className='nav-item d-flex'>
            <p className='nav-link'>
              <Link
                to={`/user/${isAuthenticated().user._id}`}
                style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              >
                {`${isAuthenticated().user.username} profile`}
              </Link>
            </p>
            <button
              className='nav-link'
              style={isActive(history, '/signout')}
              onClick={() => signout(() => history.push('/'))}
            >
              Sign out
            </button>
          </li>
        </div>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
