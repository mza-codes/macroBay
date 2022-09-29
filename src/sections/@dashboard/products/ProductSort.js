import { useState } from 'react';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { useContext } from 'react';
import { ProductsRefresh } from 'src/pages/Products';
import { useEffect } from 'react';
import * as _ from "lodash";

// ----------------------------------------------------------------------



export default function ShopProductSort() {
  const [open, setOpen] = useState(null);
  let localProducts
  const [label, setLabel] = useState('')
  const { setReload } = useContext(ProductsRefresh)
  var storedArray = sessionStorage.getItem("localProducts");

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const SORT_BY_OPTIONS = [
    { value: 'name', state: '-', label: 'Featured' },
    { value: 'postDate', state: 'date', label: 'Newest' },
    { value: 'price', state: '-', label: 'Price: Low-High' },
    { value: 'price', state: 'priceHigh', label: 'Price: High-Low' }
  ];

  // const handleSort = (props, state) => {
  //   console.log(props, state);
  //   let sorted
  //   if (storedArray == null) {
  //     console.log('storedArray NULL Found FIX THIS');
  //   } else {
  //     localProducts = JSON.parse(storedArray)
  //     if (state === 'date') {
  //       sorted = _.sortBy(localProducts, 'name').reverse()
  //       // sorted = localProducts.sort((a, b) =>
  //       //   a.postDate.split('/').reverse().join().localeCompare(b.postDate.split('/').reverse().join()))
  //     } else if (props === 'price' && state === 'priceHigh') {
  //       sorted = localProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  //     } else if (props === 'price') {
  //       sorted = localProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  //     } else {
  //       sorted = _.sortBy(localProducts, 'name')
  //     }
  //     sessionStorage.setItem("localProducts", JSON.stringify(sorted));
  //     setReload(true)
  //     setOpen(null)
  //   }
  // }
  const handleSort = (field, arg) => {
    let sorted
    console.log(field, arg);
    if (storedArray == null) {
      console.log('storedArray NULL Found FIX THIS');
    } else {
      localProducts = JSON.parse(storedArray)
      if (arg === 'priceHigh') {
        sorted = _.sortBy(localProducts, field).reverse()
      } else if (field === 'postDate') {
        sorted = _.sortBy(localProducts, field).reverse()
      } else {
        sorted = _.sortBy(localProducts, field)
      }
      sessionStorage.setItem("localProducts", JSON.stringify(sorted));
      setReload(true)
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            // selected={!option.value===''}
            // onChange={() => }
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
