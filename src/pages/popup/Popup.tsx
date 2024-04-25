// import React from 'react';
// import logo from '@assets/img/logo.svg';
import '@pages/popup/Popup.css';
// import useStorage from '@src/shared/hooks/useStorage';
// import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import TriggersList from '@src/shared/components/TriggersList';

const Popup = () => {
  // const theme = useStorage(exampleThemeStorage);

  return (
    <div className="rounded overflow-hidden bg-slate-100 flex flex-col items-center h-full">
      <div className="bg-white w-full shadow-sm flex justify-center relative z-10">
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
