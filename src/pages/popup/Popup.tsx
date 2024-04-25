import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import TriggersList from '@src/shared/components/TriggersList';

const Popup = () => {
  return (
    <div className="rounded overflow-hidden flex flex-col items-center h-full grow relative pt-[48px]">
      <div
        className="w-full shadow-sm flex justify-center z-10 fixed top-0 left-0 right-0"
        style={{ background: 'var(--color-panel-solid)' }}>
        <div className="max-w-2xl w-full py-2 px-4">
          <h1 className="text-2xl">Trggrd</h1>
        </div>
      </div>

      <div className="max-w-2xl w-full p-4 overflow-auto grow flex justify-center">
        <TriggersList />
      </div>

      <div className="hidden bg-primary"></div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
