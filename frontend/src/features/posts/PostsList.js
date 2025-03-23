import { useGetPostsQuery } from "./postsApiSlice"
import Post from "./Post"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const PostsList = () => {
    useTitle('techPosts: Posts List')

    const { username, isManager, isAdmin } = useAuth()

    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery('postsList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = posts

        let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(postId => entities[postId].username === username)
        }

        const tableContent = ids?.length && filteredIds.map(postId => <Post key={postId} postId={postId} />)

        content = (
            <section>
                {/* <table className="table table--posts">
                    <thead className="table__thead">
                        <tr>
                            <th scope="col" className="table__th post__status">Username</th>
                            <th scope="col" className="table__th post__created">Created</th>
                            <th scope="col" className="table__th post__updated">Updated</th>
                            <th scope="col" className="table__th post__title">Title</th>
                            <th scope="col" className="table__th post__username">Owner</th>
                            <th scope="col" className="table__th post__edit">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table> */}
                <div className="text-4xl">
                    FishFlow News (Beta) is here!
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                    {tableContent}
                </div>
            </section>
        )
    }

    return content
}
export default PostsList