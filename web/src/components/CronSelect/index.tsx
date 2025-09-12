import { Input, InputProps } from 'antd';
import { useControllableValue } from 'ahooks';
import { Cron, Locale } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';

export const DEFAULT_LOCALE_ZH: Locale = {
  everyText: '每',
  emptyMonths: '每月',
  emptyMonthDays: '每月每日',
  emptyMonthDaysShort: '日',
  emptyWeekDays: '每周每日',
  emptyWeekDaysShort: '星期',
  emptyHours: '每小时',
  emptyMinutes: '每分钟',
  emptyMinutesForHourPeriod: '每',
  yearOption: '年',
  monthOption: '月',
  weekOption: '周',
  dayOption: '日',
  hourOption: '时',
  minuteOption: '分',
  rebootOption: '重启时',
  prefixPeriod: '每',
  prefixMonths: '在',
  prefixMonthDays: '的',
  prefixWeekDays: '的',
  prefixWeekDaysForMonthAndYearPeriod: '和',
  prefixHours: '于',
  prefixMinutes: '分',
  prefixMinutesForHourPeriod: '的第',
  suffixMinutesForHourPeriod: '分钟',
  errorInvalidCron: 'Cron 表达式格式错误',
  clearButtonText: '清空',
  weekDays: [
    '星期日', // Sunday - 必须为第一个，对应 Cron 的 0
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ],
  months: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  altWeekDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  altMonths: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
};

const CronSelect: React.FC<InputProps> = (props) => {
  const { value, defaultValue, onChange, ...rest } = props;
  const [state, setState] = useControllableValue<string>({
    value,
    defaultValue,
    onChange,
  });

  return (
    <div>
      <Input
        style={{ maxWidth: 220, marginBottom: 8 }}
        value={state}
        onChange={(e) => setState(e.target.value)}
        {...rest}
      />
      <Cron
        value={state}
        setValue={(value: string) => setState(value)}
        locale={DEFAULT_LOCALE_ZH}
      />
    </div>
  );
};

export default CronSelect;
