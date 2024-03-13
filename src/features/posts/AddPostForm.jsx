import React from 'react'
import { useState } from "react";
// import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { addNewPost } from './postSlice.jsx';
import {selectAllUsers} from "../users/usersSlice.jsx"

const AddPostForm = () => {

  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const users = useSelector(selectAllUsers);

  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onAuthorChanged = e => setUserId(e.target.value);
  
  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';
  
  const onSavePostClicked = ()=> {

     if (canSave) {

     try {
        setAddRequestStatus("pending")
        dispatch(addNewPost({ title, body:content, userId})).unwrap()

        // addNewPost is a Redux thunk action creator created using createAsyncThunk. It's responsible for dispatching a pending action when the asynchronous operation starts, and then dispatching either a fulfilled or rejected action based on the outcome of the asynchronous operation.

        // addNewPost({ title, body: content, userId }) dispatches the thunk action with an object containing the necessary data for adding a new post (such as title, body, and userId).
        
        // .unwrap() is chained to the dispatch function. It's used to get the fulfilled value from the promise returned by the thunk action. In this case, .unwrap() returns a promise that resolves with the value of the payload when the fulfilled action is dispatched.

        // In Redux Toolkit, when you create an asynchronous thunk action using createAsyncThunk, you only need to provide the payload creator function as the first argument to createAsyncThunk. This payload creator function is responsible for initiating the asynchronous operation and returning a promise.

        // The signature of the payload creator function is (arg, { dispatch, getState, extra }) => Promise<any>, where arg is the payload you pass to the thunk action when you dispatch it.
        
        // Here's why you don't need to pass (state, action) as parameters:
        
        // State: Inside the payload creator function, you can access the current state of the Redux store using getState() if you need it. You don't need to pass it as a parameter because getState() is provided by Redux Toolkit.
        
        // Action: The dispatch function is provided by Redux Toolkit as well, and it's used to dispatch actions from within the payload creator function. You don't need to explicitly pass (state, action) because dispatch is already available.
        
        // So, when you call createAsyncThunk, you only need to provide the payload creator function, which takes the payload (arg) and an object containing dispatch, getState, and extra as parameters. This simplifies the creation of asynchronous thunk actions in Redux Toolkit.


        setTitle('')
        setContent('')
        setUserId('')

    } catch (err) {
        console.error('failed to save the post', err)


    } finally {
       setAddRequestStatus('idle')
    }

     }






  }



  const usersOptions = users.map(user => (

    <option key={user.id} value={user.id}>
    {user.name}
    </option> 
  ))

  return (
    
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" 
                value={userId} 
                onChange={onAuthorChanged}
                >
                    <option value=""></option>
                    {usersOptions}

                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
            </form>
        </section>
  
  )
}

export default AddPostForm
