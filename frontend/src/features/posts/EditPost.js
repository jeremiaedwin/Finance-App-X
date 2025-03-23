import { useParams } from 'react-router-dom'
import EditPostForm from './EditPostForm'
import { useGetPostsQuery } from './postsApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditPost = () => {
    useTitle('techPosts: Edit Post')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { post } = useGetPostsQuery("postsList", {
        selectFromResult: ({ data }) => ({
            post: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!post || !users?.length) return <PulseLoader color={"#FFF"} />


    if (!isManager && !isAdmin) {
        if (post.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditPostForm post={post} users={users} />

    return content
}
export default EditPost