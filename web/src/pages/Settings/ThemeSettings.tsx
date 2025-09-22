import { App, Button } from 'antd';
import { MoonFilled, SunOutlined, SyncOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { ProForm, ProFormRadio } from '@ant-design/pro-components';
import { getProfile, updateProfile } from '@/services/system';

const PRIMARY_COLORS = ['#1677ff', '#ff6b6b', '#13C2C2', '#ff9f43', '#722ed1'];

const useStyles = createStyles(({ css }) => ({
  themeLayout: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 72px;
    padding-block: 10px;
  `,

  themeColor: css`
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    vertical-align: middle;
  `,
}));


const ThemeSettings = () => {
  const app = App.useApp();
  const { styles } = useStyles();

  return (
    <ProForm
      layout="vertical"
      request={async () => {
        const { postGroup, roleGroup, data } = await getProfile();

        return {
          ...data,
          deptStr: data?.dept?.deptName + ' / ' + postGroup,
          roleStr: roleGroup,
        };
      }}
      submitter={{
        render: ({ form }) => {
          return [
            <Button
              type="primary"
              key="submit"
              onClick={() => form?.submit?.()}
            >
              更新资料
            </Button>,
          ];
        },
      }}
      onFinish={async (formValues) => {
        const { deptStr, roleStr, ...data } = formValues;
        const hide = app.message.loading('正在更新');
        try {
          await updateProfile({ ...data });
          hide();
          app.message.success('更新成功');
          return true;
        } catch {
          hide();
          app.message.error('更新失败请重试！');
          return false;
        }
      }}
    >
      <ProFormRadio.Group
        name="styles"
        label="整体风格设置"
        initialValue='auto'
        options={[
          {
            label: (
              <div className={styles.themeLayout}>
                <SyncOutlined style={{ fontSize: 28 }} />
                跟随系统
              </div>
            ),
            value: 'auto',
          },
          {
            label: (
              <div className={styles.themeLayout}>
                <SunOutlined style={{ fontSize: 28 }} />
                明亮
              </div>
            ),
            value: 'light',
          },
          {
            label: (
              <div className={styles.themeLayout}>
                <MoonFilled style={{ fontSize: 28 }} />
                暗黑
              </div>
            ),
            value: 'dark',
          },
        ]}
      />

      <ProFormRadio.Group
        name="primaryColor"
        label="主题色"
        initialValue='#1677ff'
        options={PRIMARY_COLORS.map((v) => ({
          label: (
            <div className={styles.themeColor} style={{ background: v }} />
          ),
          value: v,
        }))}
      />
    </ProForm>
  );
};

export default ThemeSettings;
