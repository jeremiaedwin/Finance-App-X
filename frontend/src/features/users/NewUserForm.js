import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import useTitle from "../../hooks/useTitle"

const USER_REGEX = /^[A-z]{3,20}$/
const DISPLAYNAME_REGEX = /^[A-Za-z\s]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
    useTitle('Mudah Tech: New User')

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [displayname, setDisplayname] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [validDisplayname, setValidDisplayname] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["Employee"])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidDisplayname(DISPLAYNAME_REGEX.test(displayname))
    }, [displayname])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onDisplaynameChanged = e => setDisplayname(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
        )
        setRoles(values)
    }

    // const canSave = [roles.length, validUsername, validDisplayname, validPassword].every(Boolean) && !isLoading
    const canSave = true
    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, displayname, password, roles })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''


    const content = (
        <>
            <p className="bg-red">{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="border border-gray-400 bg-gray-200 border-4 flex flex-cols rounded-md justify-between p-2">
                    <h2 className="font-bold text-2xl text-gray-600">New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="bg-blue-400 p-2 rounded-md text-blue-800 font-bold"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} /> Save
                        </button>
                    </div>
                </div>

                {/* <div className="form__title-row">
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div> */}

                <table>
                    <tbody>
                        <tr>
                            <td>
                                Username:
                                <label className="form__label" htmlFor="username"><span className="nowrap">[3-20 letters]</span></label>
                            </td>
                            <td>
                                <input
                                    className={`form__input ${validUserClass}`}
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="off"
                                    value={username}
                                    onChange={onUsernameChanged}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="form__label" htmlFor="username">Display Name: <span className="nowrap">[3-20 letters]</span></label>
                            </td>
                            <td>
                                <input
                                    className={`form__input ${validUserClass}`}
                                    id="displayname"
                                    name="displayname"
                                    placeholder="display name"
                                    type="text"
                                    autoComplete="off"
                                    value={displayname}
                                    onChange={onDisplaynameChanged}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="form__label" htmlFor="password">
                                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                            </td>
                            <td>
                                <input
                                    className={`form__input ${validPwdClass}`}
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={onPasswordChanged}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>        

                <div className="flex mt-10">
                    <div>
                        <label className="form__label" htmlFor="roles">ASSIGNED ROLES:</label>
                    </div>
                    <select
                        id="roles"
                        name="roles"
                        className="ml-10"
                        multiple={true}
                        size="3"
                        value={roles}
                        onChange={onRolesChanged}
                    >
                        {options}
                    </select>                    
                </div>
            </form>
        </>
    )

    return content
}
export default NewUserForm