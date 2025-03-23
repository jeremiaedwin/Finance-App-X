import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetPostsQuery } from './postsApiSlice'
import { memo } from 'react'

const Post = ({ postId }) => {

    const { post } = useGetPostsQuery("postsList", {
        selectFromResult: ({ data }) => ({
            post: data?.entities[postId]
        }),
    })

    const navigate = useNavigate()

    if (post) {
        const created = new Date(post.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });

        const updated = new Date(post.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/posts/${postId}`)

        return (
            // <tr className="table__row">
            //     <td className="table__cell post__status">
            //         {post.completed
            //             ? <span className="post__status--completed">Completed</span>
            //             : <span className="post__status--open">Open</span>
            //         }
            //     </td>
            //     <td className="table__cell post__created">{created}</td>
            //     <td className="table__cell post__updated">{updated}</td>
            //     <td className="table__cell post__title">{post.title}</td>
            //     <td className="table__cell post__username">{post.username}</td>

            //     <td className="table__cell">
            //         <button
            //             className="icon-button table__button"
            //             onClick={handleEdit}
            //         >
            //             <FontAwesomeIcon icon={faPenToSquare} />
            //         </button>
            //     </td>
            // </tr>
            <div className="pl-5 pb-5 pr-5 border border-gray-400 mt-5 rounded-md">
                <div className="text-lg mt-5 font-bold">{post.title}</div>
                <div className="mt-5">{created}</div>
                <div className="mt-5 text-justify whitespace-pre-line">
                    {post.text.split(' ').slice(0, 20).join(' ')}...
                </div>
                <div>
                    <button
                        className="rounded-md bg-orange-600"
                        onClick={handleEdit}
                    >
                        Read more ...
                    </button>
                </div>
            </div>
        )

    } else return null
}

const memoizedPost = memo(Post)

export default memoizedPost