import { Router } from 'express'
import * as postController from './post.controller.js'
import tokenAuth from '../../middleware/tokenAuth.js'
import vlidation from '../../middleware/validation.js';
import { addCommentSchema, addPostSchema, deleteCommentSchema, searchPostsSchema, toggleLikeSchema, updateCommentSchema, updatePostSchema } from './post.validation.js';


const router = Router()

router.get('/all', postController.getAllPosts)

router.use(tokenAuth)

// Post CRUD
router.get('/my', postController.getMyPosts)
router.post('/add', vlidation(addPostSchema), postController.addPost)
router.patch('/:postId/update', vlidation(updatePostSchema), postController.updatePost)
router.delete('/:postId/delete', postController.deletePost)

// Search , Like, Comment CRUD
router.get('/search', vlidation(searchPostsSchema), postController.searchPosts)
router.get('/:postId/like', vlidation(toggleLikeSchema), postController.toggleLike)

router.post('/:postId/comment', vlidation(addCommentSchema), postController.addComment)
router.delete('/:commentId/comment/delete', vlidation(deleteCommentSchema), postController.deleteComment)
router.patch('/:commentId/comment/update', vlidation(updateCommentSchema), postController.updateComment)


export default router