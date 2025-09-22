import { App, Button } from 'antd';
import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { getProfile, updateProfile } from '@/services/system';

const BaseSettings = () => {
  const app = App.useApp();

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
      <ProFormText
        name="nickName"
        label="昵称"
        width="md"
        rules={[{ required: true, message: '请输入昵称' }]}
      />
      <ProFormText
        name="phonenumber"
        label="手机号码"
        width="sm"
        rules={[{ required: true, message: '请输入手机号码' }]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        width="md"
        rules={[{ required: true, message: '请输入邮箱' }]}
      />
      <ProFormRadio.Group
        name="sex"
        label="性别"
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
