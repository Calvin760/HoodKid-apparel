import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Loading from './Loading';

const RequireAdmin = ({ children }) => {
    const { isLoaded, user } = useUser();

    if (!isLoaded) return <Loading />;
    if (!user) return <Navigate to="/" replace />;
    if (user.publicMetadata?.role !== 'admin') return <Navigate to="/" replace />;

    return children;
};

export default RequireAdmin;