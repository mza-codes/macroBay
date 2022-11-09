import { useState } from 'react';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';
import * as _ from "lodash";

export default function ResultSort({actions}) {
  const [open, setOpen] = useState(null);
  let localProducts
  const { products, setProducts } = actions;
  const [label, setLabel] = useState('')
  
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const SORT_BY_OPTIONS = [
    { value: 'name', state: '-', label: 'Featured' },
    { value: 'postDate', state: 'date', label: 'Newest' },
    { value: 'price', state: 'priceHigh', label: 'Price: Low-High' },
    { value: 'price', state: '-', label: 'Price: High-Low' }
  ];

  const handleSort = (props, state) => {
    console.log(props, state);
    let sorted
    if (products == null) {
      console.log('storedArray NULL Found FIX THIS');
    } else {
      localProducts = products
      if (state === 'date') {
        console.log('sort by date');
        // sorted = _.sortBy(localProducts, 'date').reverse()
        sorted = _.sortBy(localProducts, 'postDate').reverse()
        // sorted = localProducts.sort((a, b) =>
        //   a.postDate.split('/').reverse().join().localeCompare(b.postDate.split('/').reverse().join()))
      } else if (props === 'price' && state === 'priceHigh') {
        // sorted = localProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        sorted = _.sortBy(localProducts, 'price')
      } else if (props === 'price') {
        // sorted = localProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        sorted = _.sortBy(localProducts, 'price').reverse()
      } else {
        sorted = _.sortBy(localProducts, 'name')
        // sorted = _.sortBy(localProducts, ['name','price'])
      };

      setProducts(sorted)
      setOpen(null)
    }

  }
  // useEffect(() => {

  // }, [handleSort])
  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        // onClick={() => { setReload(false) }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            value={option.value}
            onClick={() => { setLabel(option.label); handleSort(option.value, option.state) }}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
