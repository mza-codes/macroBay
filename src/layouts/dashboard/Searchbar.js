import { useState } from 'react';
import * as Yup from 'yup'
// material
import { styled, alpha } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, Select, MenuItem } from '@mui/material';
import Iconify from '../../components/Iconify';
import { useNavigate } from 'react-router-dom';
import { selectValues } from 'src/pages/CreatePostFormSimple';
import { Form, Formik } from 'formik';

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  // zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

export default function Searchbar() {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  let selections = selectValues;
  
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = (values, actions) => {
    const { query, category } = values
    console.log('data onSubmit', values);
    navigate('/dashboard/result', { state: { category, params: query } })
    setOpen(false);
    return;
  };
  const schema = Yup.object().shape({
    query: Yup.string().min(2, 'Query too short').max(20, 'Query Character limit reached'),
    category: Yup.string()
  });

  return (
    <div>
      {!isOpen && (
        <IconButton onClick={handleOpen}>
          <Iconify icon="eva:search-fill" width={20} height={20} />
        </IconButton>
      )}
      <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
        <SearchbarStyle>
          <Formik initialValues={{ query: '', category: 'a' }}
            validationSchema={schema}
            onSubmit={handleSearch} >
            {props => (
              <Form>
                {/* <ClickAwayListener onClickAway={handleClose}> */}
                <Input
                  autoFocus
                  disableUnderline
                  placeholder="Search…"
                  name='query'
                  value={props.values.query}
                  onChange={(e) => { props.setFieldValue('query', e.target.value) }}
                  startAdornment={
                    <>
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                      </InputAdornment>
                    </>
                  }
                  sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
                />
                {/* </ClickAwayListener> */}
                <Select
                  sx={{ mr: 2, height: 25 }}
                  variant="outlined"
                  name='category'
                  value={props.values.category}
                  onChange={(e) => { props.setFieldValue('category', e.target.value) }}
                >
                  <MenuItem value='a' > All </MenuItem>
                  {selections.map((option) => {
                    return (
                      <MenuItem key={option} value={option}> {option} </MenuItem>
                    )
                  })}
                </Select>
                <Button type='submit' variant="contained" > Search </Button>
              </Form>
            )}
          </Formik>
          <Button color='error' onClick={handleClose} sx={{ mx: 1 }} > <Iconify icon='eva:close-circle-fill' height={25} width={25} /> </Button>
        </SearchbarStyle>
      </Slide>
    </div>
  );
}
