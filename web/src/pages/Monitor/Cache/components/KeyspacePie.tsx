import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import { rawT, useT, T } from '@/locales';

interface KeyspacePieProps {
  data: { hits: number; misses: number };
}

const KeyspacePie: React.FC<KeyspacePieProps> = ({ data }) => {
  const t = useT();
  const ref = useRef(null);
  const chart = useRef<echarts.ECharts>();

  useEffect(() => {
    const hits = data.hits || 0;
    const misses = data.misses || 0;

    chart.current = echarts.init(ref.current);
    chart.current.setOption({
      title: {
        text: t('page.monitor.cache.keyspace'),
      },
      tooltip: {
        trigger: 'item',
      },
      label: {
        formatter: '{b} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: hits, name: t('page.monitor.cache.keyspace.success') },
            { value: misses, name: t('page.monitor.cache.keyspace.error') },
          ],
        },
      ],
    });

    return () => {
      chart.current?.dispose();
    };
  }, [data, t]);

  return <div ref={ref} style={{ height: 320 }}></div>;
};

export default KeyspacePie;
