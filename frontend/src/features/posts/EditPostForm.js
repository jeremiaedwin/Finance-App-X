import { useState, useEffect } from "react";
import {
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./postsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditPostForm = ({ post, users }) => {
  const { isManager, isAdmin } = useAuth();

  const [updatePost, { isLoading, isSuccess, isError, error }] =
    useUpdatePostMutation();

  const [
    deletePost,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeletePostMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(post.title);
  const [text, setText] = useState(post.text);
  const [completed, setCompleted] = useState(post.completed);
  const [userId, setUserId] = useState(post.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      setCompleted(true);
      navigate("/dash/posts");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  // const canSave = [schemeName, aiPrompt, userId].every(Boolean) && !isLoading
  const canSave = true;

  const onSavePostClicked = async (e) => {
    if (canSave) {
      await updatePost({
        id: post.id,
        user: userId,
        title,
        text,
        completed,
      });
      alert(`Scoring scheme: ${title} succesfully saved!`);
    } else {
      alert("canSave is False");
    }
  };

  const onDeletePostClicked = async () => {
    await deletePost({ id: post.id });
  };

  const created = new Date(post.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(post.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validSchemeNameClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button bg-actionRed hover:bg-red-600"
        schemeName="Delete"
        onClick={onDeletePostClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      <div className="grid ">
        <div className="bg-white  px-4 pt-3 rounded-sm border border-gray-200 shadow-md shadow-black/10">
          <div className="border-b border-b-gray-200 pb-3">
            <p className={errClass}>{errContent}</p>
            <form className="" onSubmit={(e) => e.preventDefault()}>
              <div className="text-xl">
                {/* <strong>Edit Post #{post.ticket}</strong> */}
                <strong>Content #{post.ticket}</strong>
                {/* <div className="">
                  <button
                    className="icon-button bg-actionGreen hover:bg-green-700"
                    schemeName="Save"
                    onClick={onSavePostClicked}
                    // disabled={!canSave}
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                  {deleteButton}
                </div> */}
              </div>

              {/* <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-[100px]">schemeName</td>
                    <td className="w-[100px]">:</td>
                    <td> */}
                      {/* <input
                        // className={`form__input ${validSchemeNameClass}`}
                        className="p-2 bg-gray-50 outline-none border border-slate-300 focus:border-blue-600 rounded-md text-sm w-full resize-none overflow-scroll-x"
                        id="post-schemeName"
                        name="schemeName"
                        type="text"
                        autoComplete="off"
                        value={title}
                        onChange={onTitleChanged}
                      /> */}
                      <div className="text-lg mt-5 font-bold">
                        {title}
                      </div>
                    {/* </td>
                  </tr>
                  <tr>
                    <td>groupCriteriaId</td>
                    <td>:</td>
                    <td> */}
                      {/* <textarea
                        // className={`form__input form__input--text ${validTextClass}`}
                        className="p-2 bg-gray-50 outline-none border border-slate-300 focus:border-blue-600 rounded-md text-sm w-full resize-none overflow-scroll-x"
                        id="post-text"
                        name="text"
                        value={text}
                        onChange={onTextChanged}
                      /> */}
                      <div className="mt-5 text-justify whitespace-pre-line">
                        {text}
                      </div>
                    {/* </td>
                  </tr>
                </tbody>
              </table> */}

              <div className="form__row py-2 mx-3">
                <div className="flex flex-row justify-between">
                  <div className="form__divider mb-4 flex items-center gap-4 md:gap-28">
                    <label
                      className="form__label form__checkbox-container"
                      htmlFor="post-username"
                    >
                      Author:
                    </label>
                    <select
                      className="border border-gray-400 focus:border-blue-600 rounded-md outline-none"
                      id="post-username"
                      name="username"
                      // className="form__select"
                      value={userId}
                      onChange={onUserIdChanged}
                    >
                      {options}
                    </select>
                  </div>
                  <div className="">
                    <button
                      className="icon-button bg-actionGreen hover:bg-green-700"
                      schemeName="Save"
                      onClick={onSavePostClicked}
                      // disabled={!canSave}
                    >
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    {deleteButton}
                  </div>
                </div>
                <div className="form__divider font-medium flex flex-col gap-2">
                  <p className="form__created">
                    Created:
                    <br />
                    {created}
                  </p>
                  <p className="form__updated">
                    Updated:
                    <br />
                    {updated}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );

  return content;
};

export default EditPostForm;
