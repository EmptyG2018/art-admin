import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

interface KeyspacePieProps {
  data: { hits: number; misses: number };
}

const KeyspacePie: React.FC<KeyspacePieProps> = ({ data }) => {
  const ref = useRef(null);
  const chart = useRef<echarts.ECharts>();

  useEffect(() => {
    const hits = data.hits || 0;
    const misses = data.misses || 0;

    chart.current = echarts.init(ref.current);
    chart.current.setOption({
      title: {
        text: '缓存命中率',
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: hits, name: '缓存命中成功' },
            { value: misses, name: '缓存命中失败' },
          ],
        },
      ],
    });

    return () => {
      chart.current?.dispose();
    };
  }, [data]);

  return <div ref={ref} style={{ height: 320 }}></div>;
};

export default KeyspacePie;
