import { App, Button } from 'antd';
import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { useIntl, FormattedMessage } from 'react-intl';
import { queryDictsByType } from '@/services/dict';
import { getProfile, updateProfile } from '@/services/system';

const BaseSettings = () => {
  const app = App.useApp();
  const intl = useIntl();

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
              <FormattedMessage
                id="settings.form.updateSubmit"
                defaultMessage="更新资料"
              />
            </Button>,
          ];
        },
      }}
      onFinish={async (formValues) => {
        const { deptStr, roleStr, ...data } = formValues;
        const hide = app.message.loading(
          intl.formatMessage({
            id: 'component.form.message.update.loading',
            defaultMessage: '正在修改',
          }),
        );
        try {
          await updateProfile({ ...data });
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
      <ProFormText
        name="nickName"
        label={
          <FormattedMessage
            id="settings.basic.nickname"
            defaultMessage="昵称"
          />
        }
        width="md"
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              {
                id: 'component.form.placeholder',
                defaultMessage: '请输入{label}',
              },
              {
                label: intl.formatMessage({
                  id: 'settings.basic.nickname',
                  defaultMessage: '昵称',
                }),
              },
            ),
          },
        ]}
      />
      <ProFormText
        name="phonenumber"
        label={
          <FormattedMessage
            id="settings.basic.phone"
            defaultMessage="手机号码"
          />
        }
        width="sm"
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              {
                id: 'component.form.placeholder',
                defaultMessage: '请输入{label}',
              },
              {
                label: intl.formatMessage({
                  id: 'settings.basic.phone',
                  defaultMessage: '手机号码',
                }),
              },
            ),
          },
        ]}
      />
      <ProFormText
        name="email"
        label={
          <FormattedMessage id="settings.basic.email" defaultMessage="邮箱" />
        }
        width="md"
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              {
                id: 'component.form.placeholder',
                defaultMessage: '请输入{label}',
              },
              {
                label: intl.formatMessage({
                  id: 'settings.basic.email',
                  defaultMessage: '邮箱',
                }),
              },
            ),
          },
        ]}
      />
      <ProFormRadio.Group
        name="sex"
        label={
          <FormattedMessage id="settings.basic.sex" defaultMessage="性别" />
        }
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
