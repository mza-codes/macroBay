import { useState } from 'react';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import * as _ from "lodash";
import { useProductContext } from 'src/Contexts/ProductContext';

export default function ShopProductSort() {
  const { saleItems, setSaleItems } = useProductContext();
  const [open, setOpen] = useState(null);
  const [label, setLabel] = useState('');

  const SORT_BY_OPTIONS = [
    { value: 'name', state: '-', label: 'Featured' },
    { value: 'postDate', state: 'date', label: 'Newest' },
    { value: 'price', state: '-', label: 'Price: Low-High' },
    { value: 'price', state: 'priceHigh', label: 'Price: High-Low' }
  ];

  // const handleSortv1 = (props, state) => {
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

    if (arg === 'priceHigh') {
      sorted = _.sortBy(saleItems, field).reverse();
      setSaleItems(sorted);

    } else if (field === 'postDate') {
      sorted = _.sortBy(saleItems, field).reverse();
      setSaleItems(sorted);
    } else {
      sorted = _.sortBy(saleItems, field);
      setSaleItems(sorted);
    };
    setOpen(null);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={e=>setOpen(e.currentTarget)}
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
        onClose={e=>setOpen(null)}
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
