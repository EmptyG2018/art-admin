import { App, Button } from 'antd';
import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { useT, T } from '@/locales';
import { queryDictsByType } from '@/services/dict';
import { getProfile, updateProfile } from '@/services/system';

const BaseSettings = () => {
  const app = App.useApp();
  const t = useT();

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
              <T id="settings.form.updateSubmit" />
            </Button>,
          ];
        },
      }}
      onFinish={async (formValues) => {
        const { deptStr, roleStr, ...data } = formValues;
        const hide = app.message.loading(
          t('component.form.message.update.loading'),
        );
        try {
          await updateProfile({ ...data });
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
      <ProFormText
        name="nickName"
        label={<T id="settings.basic.nickname" />}
        width="md"
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('settings.basic.nickname'),
            }),
          },
        ]}
      />
      <ProFormText
        name="phonenumber"
        label={<T id="settings.basic.phone" />}
        width="sm"
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('settings.basic.phone'),
            }),
          },
        ]}
      />
      <ProFormText
        name="email"
        label={<T id="settings.basic.email" />}
        width="md"
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('settings.basic.email'),
            }),
          },
        ]}
      />
      <ProFormRadio.Group
        name="sex"
        label={<T id="settings.basic.sex" />}
        request={async () => {
          const res = await queryDictsByType('sys_user_sex');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
    </ProForm>
  );
};

export default BaseSettings;
