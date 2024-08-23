/*import { store } from '../src/store';
import { addComment, deleteComment } from '../features/commentsSlice';
import axios from 'axios';

jest.mock('axios');

describe('Forum operations', () => {
  it('should add a comment to the forum', async () => {
    const newComment = { id: 'comment1', content: 'This is a new comment' };

    axios.post.mockResolvedValueOnce({
      data: newComment,
    });

    await store.dispatch(addComment(newComment));
    const state = store.getState();
    expect(state.comments).toContainEqual(newComment);
  });

  it('should delete a comment from the forum', async () => {
    const commentId = 'comment1';

    axios.delete.mockResolvedValueOnce({
      data: { id: commentId },
    });

    await store.dispatch(deleteComment(commentId));
    const state = store.getState();
    expect(state.comments).not.toContainEqual(expect.objectContaining({ id: commentId }));
  });
});*/
