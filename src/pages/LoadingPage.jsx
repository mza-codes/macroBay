import '../App.css';

const LoadingPage = () => {
  return (
    <div className='loadingPage'>
      <div class="macro-loader">
        <div />
        <div />
        <div />
      </div>
      <h4>Please Wait while loading contents! </h4>
    </div>
  );
};

export default LoadingPage;

export const BarLoader = () => (
  <main className='centerLoader'>
    <div className='macro-loader'>
      <div />
      <div />
      <div />
    </div>
    <h5>Loading..</h5>
  </main>
  );