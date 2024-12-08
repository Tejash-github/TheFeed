// pages/api/posts/[id].js
import dbConnect from '../../../lib/db';
import Post from '../../../models/Post';
import PostComponent from '../../../components/Post';
import { useEffect } from 'react';

const PostPage = ({ post }) => {
  const userId = JSON.parse(localStorage.getItem('user'))._id; 

  useEffect(() => {
    const logInteraction = async () => {
      await fetch('/api/logPostInteraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, postId: post._id }),
      });
    };

    logInteraction();
  }, [post._id, userId]);
  return (
    <div>
      <PostComponent post={post} />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  await dbConnect();
  const post = await Post.findById(params.id).lean();

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
}


export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'DELETE') {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(204).end();
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}