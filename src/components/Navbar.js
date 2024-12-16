import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { Button, Stack } from '@mantine/core';

const Navbar = () => {
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    return (
        <Stack spacing="md" p="md">
            <Button component={Link} to="/" fullWidth>
                Home
            </Button>
            <Button component={Link} to="/register" fullWidth>
                Register
            </Button>
            <Button component={Link} to="/login" fullWidth>
                Login
            </Button>
            {token && (
                <Button
                    color="red"
                    variant="outline"
                    fullWidth
                    onClick={() => {
                        logout();
                        navigate('/login', { replace: true });
                    }}
                >
                    Logout
                </Button>
            )}
        </Stack>
    );
};

export default Navbar;
