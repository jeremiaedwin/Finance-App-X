import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
import PulseLoader from 'react-spinners/PulseLoader'

const Login = () => {
    useTitle('User Login')

    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')


            navigate('/dash')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message + "  Error in Connection to API. Check your base URL Ref: 2001");
            }
            errRef.current.focus();
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <PulseLoader color={"#FFF"} />

    const content = (
        <div className='container-fluid mx-auto p-10 bg-blue-100 min-h-screen flex flex-col  justify-center items-center'>
            <div class="grid grid-cols-2 w-full rounded-xl drop-shadow">
                <div className="min-h-screen bg-white flex flex-col justify-center items-center px-10">
                    <img src="/img/login_page.png" alt="sdg" className="w-120" />
                </div>

                
                <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                    <div className="w-full max-w-md p-8 rounded-lg">
                        <header className="text-center">
                            <h1 className="text-blue-900 text-4xl font-semibold">Welcome Back!</h1>
                            <p className="text-gray-600 text-sm mt-4">Please Sign-In to Continue </p>

                        </header>

                        <div className="mt-6">
                            <p ref={errRef} className={`${errClass} text-red-500 text-center mb-4`} aria-live="assertive">
                                {errMsg}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        value={username}
                                        onChange={handleUserInput}
                                        autoComplete="off"
                                        placeholder="Enter your username"
                                        required
                                        className=" appearance-none border-solid border-0 border-b border-gray-900 focus:outline-none focus:border-blue-500 focus:ring-0 w-full text-gray-700 leading-tight bg-white"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={handlePwdInput}
                                        value={password}
                                        placeholder="Enter your password"
                                        required
                                        className=" appearance-none border-solid border-0 border-b border-gray-900 focus:outline-none focus:border-blue-500 focus:ring-0 w-full text-gray-700 leading-tight bg-white"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="persist"
                                        onChange={handleToggle}
                                        checked={persist}
                                        className="h-4 w-4 text-black border-gray-300 rounded focus:ring-teal-500"
                                    />
                                    <label htmlFor="persist" className="ml-2 block text-sm text-gray-900">
                                        Trust This Device
                                    </label>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        
    )

    return content
}
export default Login
