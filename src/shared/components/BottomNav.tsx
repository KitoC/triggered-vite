const height = '48px';
const BottomNav = () => {
  return (
    <>
      <div className={`h-[${height}]`} />
      <div
        className={`h-[${height}] w-full shadow-sm flex justify-center z-10 fixed bottom-0 left-0 right-0`}
        style={{ background: 'var(--color-panel-solid)' }}>
        <div className="max-w-2xl w-full py-2 px-4">
          <h1 className="text-2xl">bottom</h1>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
