import React from 'react';
import { App } from 'antd';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
import { queryDeptTreeList } from '@/services/dept';
import { queryDictsByType } from '@/services/dict';
import { queryAllPost } from '@/services/post';
import { queryAllRole } from '@/services/role';
import { addUser } from '@/services/user';

interface CreateFormProps {
  trigger: JSX.Element;
  onFinish?: () => void;
}

const CreateUserForm: React.FC<CreateFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, onFinish } = props;

  return (
    <ModalForm
      title="新增用户"
      trigger={trigger}
      rowProps={{ gutter: 16 }}
      grid
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addUser(formValues);
          onFinish?.();
          hide();
          message.success('添加成功');
          return true;
        } catch {
          hide();
          message.error('添加失败请重试！');
          return false;
        }
      }}
    >
      <ProFormText
        name="userName"
        label="用户名"
        placeholder="请输入用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 2, message: '用户名不能小于2位' },
        ]}
        colProps={{ span: 12 }}
      />
      <ProFormText
        name="nickName"
        label="昵称"
        placeholder="请输入昵称"
        rules={[
          { required: true, message: '请输入昵称' },
          { min: 2, message: '昵称不能小于2位' },
        ]}
        colProps={{ span: 12 }}
      />
      <ProFormText
        name="phonenumber"
        label="手机号码"
        placeholder="请输入手机号码"
        rules={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确' }]}
        colProps={{ span: 12 }}
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        rules={[{ type: 'email', message: '邮箱格式不正确' }]}
        colProps={{ span: 12 }}
      />
      <ProFormTreeSelect
        name="deptId"
        label="所属部门"
        placeholder="请选择所属部门"
        rules={[{ required: true, message: '请选择所属部门' }]}
        fieldProps={{
          fieldNames: { label: 'label', value: 'id', children: 'children' },
        }}
        request={async () => {
          const res = await queryDeptTreeList();
          return res.data;
        }}
        colProps={{ span: 12 }}
      />
      <ProFormSelect
        name="postIds"
        label="岗位"
        placeholder="请选择岗位"
        initialValue={[]}
        mode="multiple"
        request={async () => {
          const res = await queryAllPost();
          return res.data.map((post) => ({
            label: post.postName,
            value: post.postId,
          }));
        }}
        colProps={{ span: 12 }}
      />
      <ProFormSelect
        name="roleIds"
        label="角色"
        placeholder="请选择角色"
        initialValue={[]}
        mode="multiple"
        request={async () => {
          const res = await queryAllRole();
          return res.data.map((role) => ({
            label: role.roleName,
            value: role.roleId,
          }));
        }}
        colProps={{ span: 12 }}
      />
      <ProFormSelect
        name="sex"
        label="性别"
        placeholder="请选择性别"
        request={async () => {
          const res = await queryDictsByType('sys_user_sex');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
        colProps={{ span: 12 }}
      />
      <ProFormText.Password
        name="password"
        label="密码"
        placeholder="请输入密码"
        rules={[
          { required: true, message: '请输入密码' },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
            message: '密码至少包含字母和数字，且长度在6-20位之间',
          },
        ]}
        colProps={{ span: 12 }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        placeholder="请选择状态"
        initialValue="0"
        request={async () => {
          const res = await queryDictsByType('sys_normal_disable');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
        colProps={{ span: 12 }}
      />
      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
    </ModalForm>
  );
};

export default CreateUserForm;
