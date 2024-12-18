import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../utils/useAuth'

const ProtectedRoute = () => {
    const {token} = useAuth();

    if (!token) {
        return (
            <Navigate
                to={'/'}
                state={{ msg: 'Unauthorised user! Please login to access that page' }}
            />
        )
    }

    return (
        <Outlet />
    )

}

export default ProtectedRoute;