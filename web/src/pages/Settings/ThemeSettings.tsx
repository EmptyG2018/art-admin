import { App, Button } from 'antd';
import { MoonFilled, SunOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { ProForm, ProFormRadio } from '@ant-design/pro-components';
import { useT, T } from '@/locales';
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
  const t = useT();
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
              <T id="settings.form.updateSubmit" />
            </Button>,
          ];
        },
      }}
      onFinish={async (formValues) => {
        const hide = app.message.loading(
          t('component.form.message.update.loading'),
        );
        try {
          updateSystemConfig({
            theme: JSON.stringify({
              ...formValues,
              colorInfo: formValues.colorPrimary,
            }),
          });
          hide();
          app.message.success(t('component.form.message.update.success'));
          return true;
        } catch {
          hide();
          app.message.error(t('component.form.message.update.error'));
          return false;
        }
      }}
    >
      <ProFormRadio.Group
        name="layout"
        label={<T id="settings.appearance.style" />}
        initialValue={theme.layout}
        options={[
          {
            label: (
              <div className={styles.themeLayout}>
                <SunOutlined style={{ fontSize: 28 }} />
                <T id="settings.appearance.style.light" />
              </div>
            ),
            value: 'light',
          },
          {
            label: (
              <div className={styles.themeLayout}>
                <MoonFilled style={{ fontSize: 28 }} />
                <T id="settings.appearance.style.dark" />
              </div>
            ),
            value: 'dark',
          },
        ]}
      />

      <ProFormRadio.Group
        name="colorPrimary"
        label={<T id="settings.appearance.primary" />}
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
