import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { singlePost } from './apiPost';
import { update } from './apiPost';
import DeletePost from './DeletePost';
import DefaultPicture from '../images/avatar.png';
import { Link } from 'react-router-dom';
import CarouselPhoto from './CarouselPhoto';

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      files: [],
      photos: [],
      post: '',
      redirectToProfile: false,
      error: '',
      fileSize: 0,
      loading: false,
      img: false,
      created: '',
      postForImages: {},
    };
  }

  init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          post: data.post,
          photo: data.photosUrls,
          error: '',
          created: data.created,
          postForImages: data,
        });
      }
    });
  };

  checkPhotos = (postId) => {
    singlePost(postId).then((data) => {
      if (data.photosUrl) {
        this.setState({ img: true });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
    this.checkPhotos(postId);
  }

  setImageToState = (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      this.state.photos.push(reader.result);
    };
    console.log(this.state);
  };

  handleChange = (state) => (event) => {
    this.setState({ error: '' });
    // console.log(event.target.files);
    console.log(event.target.files);
    if (event.target.files !== []) {
      this.setState({ photos: this.state.postForImages.photoUrls });
    }
    if (state === 'photos') {
      const files = event.target.files;
      console.log(files);
      for (let index = 0; index < files.length; index++) {
        this.state.files.push(files[index]);
        this.setImageToState(files[index]);
      }
    } else {
      const value = event.target.value;
      this.setState({ [state]: value });
    }
    console.log(this.state);
  };

  clickUpdate = async (event) => {
    // console.log(this.state);
    event.preventDefault();
    this.setState({ loading: true });

    // console.log(event.target.photos.value);

    if (this.isValid()) {
      const postId = this.props.match.params.postId;
      const token = isAuthenticated().token;
      //send photo to cloudinary and save urls in state
      console.log(this.state.files);

      console.log(this.state);
      const postData = { post: this.state.post, photos: this.state.photos };

      const data = await update(postId, token, postData);
      if (data.error)
        this.setState({ error: data.error, loading: false, post: '' });
      else {
        this.setState({
          redirectToProfile: true,
          loading: false,
          files: [],
          post: '',
          photos: [],
          isPosted: true,
          postForImages: [],
        });
      }

      // console.log(this.state);
    }
  };

  isValid = () => {
    const { post, fileSize } = this.state;

    if (fileSize >= 300000) {
      this.setState({
        error: 'File size should be less than 300KB',
        loading: false,
      });
      return false;
    }
    if (post.length === 0) {
      this.setState({ error: 'All fields are required', loading: false });
      return false;
    }
    return true;
  };

  updateForm = (post) => {
    return (
      <div className='row'>
        <div className='col-lg-6 col-md-10 mt-5 mx-auto'>
          <form>
            <div className='form-group'>
              <textarea
                onChange={this.handleChange('post')}
                type='text'
                className='form-control'
                value={post}
                style={{
                  whiteSpace: 'pre',
                }}
              />
            </div>
            <br />

            <div className='form-group'>
              <input
                onChange={this.handleChange('photos')}
                type='file'
                className='form-control'
                accept='image/*'
                multiple
              />
            </div>

            <div className='d-inline-block'>
              <br />
              <button
                onClick={this.clickUpdate}
                className='btn btn-raised btn-outline-primary btn-md'
              >
                Update
              </button>
              <div className='d-inline ms-3'>
                <DeletePost postId={this.state.id} />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToProfile, error, postForImages, loading } =
      this.state;
    const posterId = isAuthenticated().user._id;
    const posterUsername = isAuthenticated().user.username;
    console.log(postForImages);

    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    return (
      <div>
        <div className='row'>
          <div className='card col-sm-10 mx-auto mt-5'>
            <div className='card-body'>
              {loading ? (
                <div className='jumbotron text-center'>
                  <h2>Loading...</h2>
                </div>
              ) : (
                ''
              )}
              <div
                className='alert alert-danger mt-3'
                style={{ display: error ? '' : 'none' }}
              >
                {error}
              </div>
              <div className='d-inline'>
                <img
                  style={{
                    borderRadius: '50%',
                    border: '1px solid black',
                  }}
                  className='float-left me-2'
                  height='40px'
                  width='40px'
                  onError={(i) => (i.target.src = `${DefaultPicture}`)}
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                  alt={posterUsername}
                />
                <Link
                  to={`/user/${posterId}`}
                  className='lead text-body d-inline'
                  style={{ display: 'inline', fontSize: '1.2rem' }}
                >
                  {posterUsername}{' '}
                  <p
                    style={{
                      fontSize: '0.8rem',
                      marginLeft: '50px',
                      marginTop: '-10px',
                    }}
                  >
                    {new Date(this.state.created).toDateString()}
                  </p>
                </Link>
              </div>
              <hr />
              {postForImages.photoUrls ? (
                <div className='text-center'>
                  <CarouselPhoto post={postForImages} />
                </div>
              ) : (
                ''
              )}

              {this.updateForm(post)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
