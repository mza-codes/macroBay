import * as Yup from 'yup';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { auth } from 'src/Contexts/firebaseConfig';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required').min(4).max(20),
    });

    const defaultValues = {
        email: '',
        password: '',
        remember: true,
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const { handleSubmit } = methods;

    const onSubmit = async (props) => {
        setLoading(true)
        signInWithEmailAndPassword(auth, props.email, props.password).then((result) => {
            console.log(result)
            navigate('/');
        }).catch((err) => { setErrorMsg(err.code); setLoading(false) })

    };
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}  >
            <Stack spacing={3}>
                <RHFTextField name="email" label="Email address" />

                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    // onChange={(e)=>{setPassword(e.target.value)}}
                    // value={password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Typography className='errorText'>{errorMessage}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <RHFCheckbox name="remember" label="Remember me" />
                <Link variant="subtitle2" underline="hover">
                    Forgot password?
                </Link>
            </Stack>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
                Login
            </LoadingButton>
        </FormProvider>
    );
}
