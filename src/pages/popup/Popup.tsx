import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import TriggersList from '@src/shared/components/TriggersList';
import BottomNav from '@root/src/shared/components/BottomNav';
import TopNav from '@root/src/shared/components/TopNav';

const Popup = () => {
  return (
    <div className="rounded overflow-hidden flex flex-col items-center h-full grow relative pt-[48px]">
      <TopNav />

      <div className="max-w-2xl w-full p-4 overflow-auto grow flex justify-center overflow-scroll">
        <TriggersList />
      </div>

      <BottomNav />

      <div className="hidden bg-primary"></div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
