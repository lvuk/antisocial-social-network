import React from 'react';
import NewPost from '../post/NewPost';
import Posts from '../post/Posts';

const Home = () => (
  <div className='container mt-5'>
    <h2>Home</h2>
    <p className='lead'>Welcome to React Frontend</p>
    <NewPost />
    <div className='container-fluid'>
      <Posts />
    </div>
  </div>
);

export default Home;
