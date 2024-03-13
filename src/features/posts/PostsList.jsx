import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { selectAllPosts, getPostsStatus, getPostsError, fetchPosts } from "./postSlice.jsx";
import { useEffect} from 'react';

import PostsExcerpt from './PostsExcerpt.jsx';



const PostsList = () => {

  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts)
  const postStatus = useSelector(getPostsStatus)
  const error = useSelector(getPostsError)

  useEffect(()=>{

  if (postStatus === 'idle'){
    dispatch(fetchPosts()) // send/ pass/trigger actions to & in Redux store
  }
}, [postStatus, dispatch])





let content;

if (postStatus === 'loading'){
    content = <p>Loading...</p>;
} else if (postStatus === 'suceeded') {
    const orderedPosts = posts.slice().sort((a,b)=> b.date?.localeCompare(a.date))
    content = orderedPosts.map(post=>(<PostsExcerpt key={post.id} post={post}/> ))
} else if (postStatus === 'failed') {
    content = <p>{error}</p>
}


  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostsList
