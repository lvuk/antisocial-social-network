import React from 'react';
import { isAuthenticated } from '../auth';
import NewPost from '../post/NewPost';
import Posts from '../post/Posts';

const Home = () => (
  <div className='container mt-5'>
    <h2>Home</h2>
    <p className='lead'>Welcome to React Frontend</p>
    {isAuthenticated() ? <NewPost /> : ''}
    <div className='container-fluid'>
      <Posts />
    </div>
  </div>
);

export default Home;
