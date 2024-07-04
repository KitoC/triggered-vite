const TopNav = () => {
  return (
    <div
      className="w-full shadow-sm flex justify-center z-10 fixed top-0 left-0 right-0"
      style={{ background: 'var(--color-panel-solid)' }}>
      <div className="max-w-2xl w-full py-2 px-4">
        <h1 className="text-2xl">Trggrd</h1>
      </div>
    </div>
  );
};

export default TopNav;
