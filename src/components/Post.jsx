import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "./Loading";


const Post = ({ user, setMessage }) => {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comment, setComment] = useState("");

  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const getPostById = async () => {
    const postId = id;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}`);
      setPost(response.data.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    const postId = id;
    try {
      console.log("trying to fetch comments");
      const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}/comments`);
      setComments(response.data.data);
    } catch (err) {
      console.log("Failed to fetch comments: ", err);
      setMessage("Failed to fetch comments");
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/posts/${post.id}`, { comment }, {
        withCredentials: true,
      });
      setMessage(response.data.message);
      setComment("");
      fetchComments();
    } catch (err) {
      console.error("Error submitting comment: ", err);
      setMessage("Failed to add comment. Please try again.");
    }
  };

  useEffect(() => {
    getPostById();
    fetchComments();
  }, []);

  if (loading) return <Loading />
  if (error) return <h2>{error}</h2>

  return (
    <div className="w-full flex flex-col items-center gap-5 p-5">
      <div className="w-[95%] p-3 h-auto flex flex-col bg-white text-black rounded-md">
        <h3
          className="text-xl font-bold"
        >{post.title}{" "}
          <span
            className="text-sm text-black/40 font-semibold"
          >{new Date(post.createdAt).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata",
          })}
          </span>
        </h3>
        <p
          className="text-sm font-semibold text-gray-400"
        >by {post.author.username}</p>
        <h4 className="text-lg font-semibold text-black/65">{post.message}</h4>
      </div>
      <div className="w-[85%] rounded-md p-3 text-black flex flex-col gap-5 bg-white">
        <h3 className="text-lg">Comments</h3>
        {
          user ? <form
            className="flex flex-wrap gap-2"
            onSubmit={handleCommentSubmit}
          >
            <input
              className="w-[85%] text-lg p-2 border-2 rounded-md border-gray-400"
              type="text"
              name="comment"
              id="comment"
              placeholder="Add a comment"
              value={comment}
              onChange={handleCommentChange}
              required />
            <button
              className="bg-black py-2 px-3 w-26 rounded-md text-lg font-semibold text-white hover:bg-blue-950"
              type="submit"
            >Comment</button>
          </form>
            : <h3><Link className="font-bold text-blue-600" to="/login">Login</Link> to add comment.</h3>
        }
        <div>
          {
            (comments.length > 0) ? <ul>
              {
                comments.map((comment) =>
                  <li
                    className="w-full p-2 border-b-2 border-black/40 rounded-sm"
                    key={comment.id}>
                    <h3
                      className="text-lg text-red-500 font-bold"
                    >{comment.author.username}{" "}
                      <span
                        className="text-sm text-black/40 font-semibold"
                      >{new Date(comment.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Kolkata",
                      })}
                      </span>
                    </h3>
                    <h4>{comment.comment}</h4>
                  </li>
                ).reverse()
              }
            </ul> :
              <h3>0 comments</h3>
          }
        </div>
      </div>
    </div>
  );
};

export default Post; 