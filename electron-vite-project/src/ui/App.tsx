import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { useStatistics } from './useStatistics.ts';
import { Chart } from './Chart.tsx';

function App() {
  const staticData = useStaticData();
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>('CPU');

  const cpuUsages = useMemo(() => statistics.map((stat) => stat.cpuUsage), [statistics]);

  const ramUsages = useMemo(() => statistics.map((stat) => stat.ramUsage), [statistics]);

  const storageUsages = useMemo(() => statistics.map((stat) => stat.storageUsage), [statistics]);

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case 'CPU':
        return cpuUsages;
      case 'RAM':
        return ramUsages;
      case 'STORAGE':
        return storageUsages;
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  return (
    <>
      <div className="main">
        <div>
          <SelectOption
            onClick={() => setActiveView('CPU')}
            title="CPU"
            subTitle={staticData?.cpuModel ?? ''}
            data={cpuUsages}
          />
          <SelectOption
            onClick={() => setActiveView('RAM')}
            title="RAM"
            subTitle={(staticData?.totalMemoryGB.toString() ?? '') + ' GB'}
            data={ramUsages}
          />
          <SelectOption
            onClick={() => setActiveView('STORAGE')}
            title="STORAGE"
            subTitle={(staticData?.totalStorage.toString() ?? '') + ' GB'}
            data={storageUsages}
          />
        </div>
        <div className="mainGrid">
          <Chart selectedView={activeView} data={activeUsages} maxDataPoints={10} />
        </div>
      </div>
    </>
  );
}

interface SelectOptionProps {
  title: 'CPU' | 'RAM' | 'STORAGE';
  subTitle: string;
  data: number[];
  onClick: () => void;
}

function SelectOption({ title, subTitle, data, onClick }: SelectOptionProps) {
  return (
    <button className="selectOption" onClick={onClick}>
      <div className="selectOptionTitle">
        <div>{title}</div>
        <div>{subTitle}</div>
      </div>
      <div className="selectOptionChart">
        <Chart selectedView={title} data={data} maxDataPoints={10} />
      </div>
    </button>
  );
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}

export default App;
