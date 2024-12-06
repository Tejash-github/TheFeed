// pages/posts/[id].js
import dbConnect from '../../lib/db';
import Post from '../../models/Post';
import PostComponent from '../../components/Post';

const PostPage = ({ post }) => {
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

export default PostPage;