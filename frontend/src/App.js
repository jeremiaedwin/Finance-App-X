import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';

import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditNote from './features/notes/EditNote'
import NewNote from './features/notes/NewNote'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle';

import LayoutMain from './components/LayoutMain'

import PostsList from './features/posts/PostsList'
import EditPost from './features/posts/EditPost'

import TransactionList from './features/transactions/TransactionList'
import Report from './features/reports/Report'


function App() {
  useTitle('FishFlow IoT')

  return (
    <Routes>
      <Route path="/" element={<LayoutMain />}>
        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<Layout />}>
                <Route index element={<Welcome />} />
                
                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>

                

                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="transactions">
                  <Route index element={<TransactionList />} />
                </Route>

                <Route path="reports">
                  <Route index element={<Report />} />
                </Route>

               
                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>
                <Route path="posts">
                  <Route index element={<PostsList />} />
                  <Route path=":id" element={<EditPost />} />
                </Route>

              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes >
  );
}

export default App;
