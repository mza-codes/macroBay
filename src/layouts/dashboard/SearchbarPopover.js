import { useRef, useState } from 'react';
import * as Yup from 'yup';
import {
  Input, Button, IconButton, InputAdornment, Select, MenuItem, Badge, Box,
  Typography, Tooltip, Divider, List
} from '@mui/material';
import Iconify from '../../components/Iconify';
import { useNavigate } from 'react-router-dom';
import { selectValues } from 'src/pages/CreatePostFormSimple';
import { Form, Formik } from 'formik';
import MenuPopover from 'src/components/MenuPopover';
import Scrollbar from 'src/components/Scrollbar';

export default function SearchbarPopOver() {
  const navigate = useNavigate();
  let selections = selectValues;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const schema = Yup.object().shape({
    query: Yup.string().min(1, 'Query too short').max(50, 'Query too High'),
    category: Yup.string()
  });

  const handleSearch = (values, actions) => {
    const { query, category } = values
    console.log('data onSubmit', values);
    navigate('/dashboard/result', { state: { category, params: query } })
    setOpen(false);
    return;
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge>
          <Iconify icon="bx:search-alt" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Formik initialValues={{ query: '', category: 'a' }}
          validationSchema={schema}
          onSubmit={handleSearch} >
          {props => (
            <Form>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">Search MacroBay</Typography>
                  <Typography variant="body2" color={props.errors.query ? 'error' : 'GrayText'}>
                    {props.errors.query ? props.errors.query : <> Let's Find it here ! </>}
                  </Typography>
                </Box>
                {!props.isValid && <>
                  <Tooltip title={props.errors.query}><div className="red"> <Iconify icon='clarity:error-line'
                    width={30} height={30} mt={0.5} /></div></Tooltip> </>}
                <Tooltip title="Clear Search">
                  <IconButton color="primary" onClick={() => { props.handleReset() }}> {/* change function to search or something */}
                    <Iconify icon="pajamas:clear-all" width={20} height={20} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Scrollbar sx={{ height: { xs: 'auto', sm: 'auto' } }}>
                <List >
                  <Input
                    autoFocus
                    disableUnderline
                    placeholder="Search…"
                    name='query'
                    value={props.values.query}
                    fullWidth
                    onChange={(e) => { props.setFieldValue('query', e.target.value) }}
                    // value={query}
                    startAdornment={
                      <>
                        <InputAdornment sx={{ ml: 2 }} position="start">
                          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                        </InputAdornment>
                      </>
                    }
                    endAdornment={
                      <>
                        <InputAdornment position="end">
                          <Select
                            // autoFocus
                            sx={{ mr: 2, height: 25 }}
                            variant="outlined"
                            name='category'
                            // value={category}
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
                        </InputAdornment>
                      </>
                    }
                    sx={{ fontWeight: 'fontWeightBold', p: 2 }}
                  />

                  <Button sx={{ mx: 17 }} disabled={!props.isValid} type='submit' variant="contained" >
                    Search
                  </Button>

                </List>
              </Scrollbar>
            </Form>
          )}
        </Formik>

        <Divider sx={{ borderStyle: 'dashed', p: 1 }} />

      </MenuPopover>
    </>
  );
}
