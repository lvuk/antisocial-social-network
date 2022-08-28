import React from 'react';
import NewPost from '../post/NewPost';

const Home = () => (
  <div className='container mt-5'>
    <h2>Home</h2>
    <p className='lead'>Welcome to React Frontend</p>
    <NewPost />
  </div>
);

export default Home;
