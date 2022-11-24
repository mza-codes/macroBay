// ----------------------------------------------------------------------
// package-json "homepage" +" /path to file"
let v = Math.floor((Math.random() * 24) + 1)
console.log(v);
const account = {
  displayName: 'Lopez Hanks',
  email: 'user@macrobay.org',
  role: 'Customer',
  photoURL: `/static/mock-images/avatars/avatar_${v}.jpg`,
};

export default account;
