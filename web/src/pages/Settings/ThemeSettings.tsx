import { App, Button } from 'antd';
import { MoonFilled, SunOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { ProForm, ProFormRadio } from '@ant-design/pro-components';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSystemStore } from '@/stores';
import { updateSystemConfig } from '@/services/system';

const PRIMARY_COLORS = ['#1677ff', '#ff6b6b', '#13c2c2', '#ff9f43', '#722ed1'];

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
  const intl = useIntl();
  const { styles } = useStyles();
  const { theme, setTheme } = useSystemStore();

  return (
    <ProForm
      layout="vertical"
      onValuesChange={(_, values) => {
        setTheme({
          ...values,
          colorInfo: values.colorPrimary,
        });
      }}
      submitter={{
        render: ({ form }) => {
          return [
            <Button
              type="primary"
              key="submit"
              onClick={() => form?.submit?.()}
            >
              <FormattedMessage
                id="settings.form.updateSubmit"
                defaultMessage="更新资料"
              />
            </Button>,
          ];
        },
      }}
      onFinish={async (formValues) => {
        const hide = app.message.loading(
          intl.formatMessage({
            id: 'component.form.message.update.loading',
            defaultMessage: '正在修改',
          }),
        );
        try {
          updateSystemConfig({
            theme: JSON.stringify({
              ...formValues,
              colorInfo: formValues.colorPrimary,
            }),
          });
          hide();
          app.message.success(
            intl.formatMessage({
              id: 'component.form.message.update.success',
              defaultMessage: '修改成功',
            }),
          );
          return true;
        } catch {
          hide();
          app.message.error(
            intl.formatMessage({
              id: 'component.form.message.update.error',
              defaultMessage: '修改失败请重试！',
            }),
          );
          return false;
        }
      }}
    >
      <ProFormRadio.Group
        name="layout"
        label={
          <FormattedMessage
            id="settings.appearance.style"
            defaultMessage="整体风格"
          />
        }
        initialValue={theme.layout}
        options={[
          {
            label: (
              <div className={styles.themeLayout}>
                <SunOutlined style={{ fontSize: 28 }} />
                <FormattedMessage
                  id="settings.appearance.style.light"
                  defaultMessage="明亮"
                />
              </div>
            ),
            value: 'light',
          },
          {
            label: (
              <div className={styles.themeLayout}>
                <MoonFilled style={{ fontSize: 28 }} />
                <FormattedMessage
                  id="settings.appearance.style.dark"
                  defaultMessage="暗黑"
                />
              </div>
            ),
            value: 'dark',
          },
        ]}
      />

      <ProFormRadio.Group
        name="colorPrimary"
        label={
          <FormattedMessage
            id="settings.appearance.primary"
            defaultMessage="主题色"
          />
        }
        initialValue={theme.colorPrimary}
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
