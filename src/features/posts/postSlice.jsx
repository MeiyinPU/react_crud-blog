import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios"

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts"

const initialState = {
  posts: [], 
  status: 'idle', // 'idle' | 'loading'| 'suceeded' |'failed'
  error: null,
}


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async()=> {

  try {
    const response = await axios.get(POSTS_URL)
    return [...response.data] // return response.data
  } catch (err){
    return err.message;
  }
})


export const addNewPost = createAsyncThunk('posts/addNewPosts', async(initialPost)=> {

  try {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data // return response.data
  } catch (err){
    return err.message;
  }
})



const postsSlice = createSlice({

    name: 'posts',
    initialState,
    reducers : {
        postAdded:{
            reducer(state, action){ //receives the state and an action
                state.posts.push(action.payload) //payload: the form data that we send or we dispatch our post added 
              // immer js under the hood
            },
            prepare(title, content, userId){ // callback function to our component
              return {
                payload: {
                  id: nanoid(),
                  title,
                  content,
                  date: new Date().toISOString(), 
                  userId,
                  reactions: {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                  }
               }
              }
            },
        },

        reactionAdded(state, action) {

        const {postId, reaction} = action.payload
        const existingPost = state.posts.find(post => post.id === postId)
        if (existingPost){
          existingPost.reactions[reaction]++
        }

        },

    },
    extraReducers(builder){
     builder
     .addCase(fetchPosts.pending, (state, action) => {
      state.status = "loading"
     })
     .addCase(fetchPosts.fulfilled, (state, action)=> {

      state.status = "suceeded"
          
      // Adding date and reactions
      let min = 1;
      const loadedPosts = action.payload.map(post => {
  
      post.data = sub(new Date(), {minutes: min++}).toISOString();
      post.reactions = {
        thumbsUp: 0,
        wow: 0,
        heart: 0,
        rocket: 0,
        coffee: 0
      }
      return post;
     });
      // Add any fetched posts to the array
      state.posts = state.posts.concat(loadedPosts)

     })
     .addCase(fetchPosts.rejected, (state, action)=>{
      state.status = 'failed'
      state.error = action.error.message
     })
     .addCase(addNewPost.fulfilled, (state, action)=> {

     action.payload.userId = Number(action.payload.userId)
     action.payload.date = new Date().toISOString();
     action.payload.reactions = {
        thumbsUp: 0,
        wow: 0,
        heart: 0,
        rocket: 0,
        coffee: 0
     }

    //  In the addCase(addNewPost.fulfilled) handler, the correct syntax is indeed action.payload.userId, not state.payload.userId. This is because the action.payload contains the data returned by the asynchronous action addNewPost, specifically the data returned by the promise when it's fulfilled.

    //  When an asynchronous action is dispatched, it typically goes through multiple stages:
     
    //  Pending: The action is dispatched, but the asynchronous operation has not yet completed.
     
    //  Fulfilled: The asynchronous operation is successful, and the promise is fulfilled. The resolved data is available in the action.payload.
     
    //  Rejected: The asynchronous operation encounters an error, and the promise is rejected. The error information is available in the action.error.
     
    //  In the case of addNewPost.fulfilled, action.payload contains the data returned by the successful execution of the addNewPost action. Therefore, to access the properties of the newly added post, such as userId, you would use action.payload.userId.
     
    //  state refers to the current state of the Redux slice being handled by this reducer. In the context of addNewPost.fulfilled, state refers to the state of the posts slice before the new post is added. Since userId is a property of the new post being added (which comes from action.payload), you should access it via action.payload.userId.


     console.log(action.payload)
     state.posts.push(action.payload)
     })
    }  
})

export const selectAllPosts = (state)=> state.posts.posts; // anonymous fonction: if the shape of the state ever changed, we would'nt have to go through and chaange each component, we can just change it once in the slice
export const getPostsStatus = (state)=> state.posts.status;
export const getPostsError = (state)=> state.posts.error;

export const {postAdded, reactionAdded} = postsSlice.actions // createSlice function automatically generates and action creator function with the same name; exporting the action creator function that is automatically created 
export default postsSlice.reducer;