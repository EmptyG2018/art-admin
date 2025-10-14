import {
  Button,
  Space,
  Tree,
  Empty,
  message,
  Tooltip,
  Row,
  Col,
  Dropdown,
  Popconfirm,
  Modal,
} from 'antd';
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
  ModalForm,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormTreeSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { useRequest, useResponsive } from 'ahooks';
import { queryUserPage, deleteUser, resetUserPwd } from '@/services/user';
import { queryDeptTree } from '@/services/dept';
import { queryAllPost } from '@/services/post';
import { queryAllRole } from '@/services/role';
import { queryDictsByType } from '@/services/dict';
import { PermissionGuard } from '@/components/Layout';
import CreateUserForm from './components/CreateUserForm';
import UpdateUserForm from './components/UpdateUserForm';

const DeptTree: React.FC<{ onSelect: (key: React.Key) => void }> = ({
  onSelect,
}) => {
  const { data: deptTree } = useRequest(async () => {
    const res = await queryDeptTree();
    return res.data;
  });

  if (!deptTree) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <Tree<any>
      rootStyle={{ padding: 8 }}
      defaultExpandAll
      blockNode
      fieldNames={{
        key: 'id',
        title: 'label',
        children: 'children',
      }}
      treeData={deptTree}
      onSelect={(selectedKeys) => onSelect(selectedKeys[0])}
    />
  );
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser(selectedRows.map((row) => row.userId).join(','));
    hide();
    message.success('删除成功');
    return true;
  } catch {
    hide();
    message.error('删除失败请重试!');
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const [deptId, setDeptId] = useState<React.Key>();
  const responsive = useResponsive();

  const columns: ProColumns[] = [
    {
      title: '用户编号',
      dataIndex: 'userId',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      valueType: 'text',
      width: 220,
      renderText: (text, record) => (
        <UpdateUserForm
          formReaonly
          formRender={formRender('edit')}
          values={record}
          trigger={<a>{text}</a>}
        />
      ),
      hideInSearch: true,
    },
    {
      title: '所属部门',
      dataIndex: 'deptId',
      valueType: 'treeSelect',
      width: 160,
      fieldProps: {
        fieldNames: { label: 'label', value: 'id', children: 'children' },
      },
      request: async () => {
        const res = await queryDeptTree();
        return res.data;
      },
      hideInSearch: true,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      valueType: 'text',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_normal_disable');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (_, record) => {
        if (record.userName === 'admin') return;
        return (
          <Space direction="horizontal" size={16}>
            <PermissionGuard requireds={['system:user:edit']}>
              <UpdateUserForm
                formRender={formRender('edit')}
                values={record}
                trigger={
                  <Tooltip title="修改">
                    <Button type="link" size="small" icon={<EditOutlined />} />
                  </Tooltip>
                }
                onFinish={() => {
                  actionRef.current?.reload();
                }}
              />
            </PermissionGuard>
            <PermissionGuard requireds={['system:user:remove']}>
              <Tooltip title="删除">
                <Popconfirm
                  title="删除记录"
                  description="您确定要删除此记录吗？"
                  onConfirm={async () => {
                    await handleRemove([record]);
                    actionRef.current?.reloadAndRest?.();
                  }}
                >
                  <Button type="link" size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </PermissionGuard>
            <PermissionGuard requireds={['system:user:resetPwd']}>
              <ModalForm
                title="重置密码"
                width={400}
                trigger={
                  <Tooltip title="重置密码">
                    <Button type="link" size="small" icon={<KeyOutlined />} />
                  </Tooltip>
                }
                modalProps={{
                  destroyOnHidden: true,
                }}
                onFinish={async (formValues) => {
                  const hide = message.loading('正在重置');
                  try {
                    await resetUserPwd({
                      ...formValues,
                      userId: record.userId,
                    });
                    hide();
                    message.success('重置成功');
                    return true;
                  } catch {
                    hide();
                    message.error('重置失败请重试！');
                    return false;
                  }
                }}
              >
                <ProFormText.Password
                  name="password"
                  label="新密码"
                  placeholder="请输入新密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
                      message: '密码至少包含字母和数字，且长度在6-20位之间',
                    },
                  ]}
                  colProps={{ span: 24 }}
                />
              </ModalForm>
            </PermissionGuard>
          </Space>
        );
      },
    },
  ];

  const formRender = (souce: '' | 'edit' | 'add' = '') => (
    <>
      <ProForm.Group title="基本信息">
        {souce === 'add' && (
          <ProFormText
            name="userName"
            label="用户名"
            placeholder="请输入用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, message: '用户名不能小于2位' },
            ]}
            width="md"
          />
        )}
        <ProFormText
          name="nickName"
          label="昵称"
          placeholder="请输入昵称"
          rules={[
            { required: true, message: '请输入昵称' },
            { min: 2, message: '昵称不能小于2位' },
          ]}
          width="md"
        />
        <ProFormText
          name="phonenumber"
          label="手机号码"
          placeholder="请输入手机号码"
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确' }]}
          width="md"
        />
        <ProFormText
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          rules={[{ type: 'email', message: '邮箱格式不正确' }]}
          width="md"
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
          width="md"
        />
      </ProForm.Group>

      <ProForm.Group title="组织与权限信息">
        <ProFormTreeSelect
          name="deptId"
          label="所属部门"
          placeholder="请选择所属部门"
          rules={[{ required: true, message: '请选择所属部门' }]}
          fieldProps={{
            fieldNames: { label: 'label', value: 'id', children: 'children' },
          }}
          request={async () => {
            const res = await queryDeptTree();
            return res.data;
          }}
          width="md"
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
          width="md"
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
          width="md"
        />
      </ProForm.Group>
      {souce === 'add' && (
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
          width="xl"
        />
      )}
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
    </>
  );

  return (
    <PageContainer
      header={{
        title: '用户管理',
      }}
    >
      <Row wrap={!responsive.md} gutter={[16, 16]}>
        <Col flex={responsive.md ? '220px' : 'auto'}>
          <DeptTree onSelect={setDeptId} />
        </Col>
        <Col flex="auto">
          <ProTable
            headerTitle="查询表格"
            actionRef={actionRef}
            rowKey="userId"
            toolBarRender={() => [
              <PermissionGuard requireds={['system:user:add']}>
                <CreateUserForm
                  formRender={formRender('add')}
                  trigger={
                    <Button type="primary" icon={<PlusOutlined />} key="add">
                      新增
                    </Button>
                  }
                  onFinish={() => {
                    actionRef.current?.reload();
                  }}
                />
              </PermissionGuard>,
              <Dropdown
                menu={{
                  items: [
                    {
                      label: '导入',
                      icon: <ImportOutlined />,
                      key: 'import',
                    },
                    {
                      label: '导出',
                      icon: <ExportOutlined />,
                      key: 'export',
                    },
                  ],
                }}
                key="menu"
              >
                <Button>
                  <EllipsisOutlined />
                </Button>
              </Dropdown>,
            ]}
            params={{ deptId }}
            request={async (params, sorter, filter) => {
              const { code, rows, total } = await queryUserPage({
                ...params,
                // FIXME: remove @ts-ignore
                // @ts-ignore
                sorter,
                filter,
              });
              return {
                data: rows,
                total,
                success: code === 200,
              };
            }}
            columns={columns}
            pagination={{
              defaultPageSize: 12,
            }}
            rowSelection={{
              onChange: (_, selectedRows) => setSelectedRows(selectedRows),
            }}
            scroll={{ x: 'max-content' }}
          />
          {selectedRowsState?.length > 0 && (
            <FooterToolbar
              extra={
                <div>
                  已选择{' '}
                  <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                  项&nbsp;&nbsp;
                </div>
              }
            >
              <PermissionGuard requireds={['system:user:remove']}>
                <Button
                  onClick={async () => {
                    Modal.confirm({
                      title: '删除记录',
                      content: '您确定要删除选中的记录吗？',
                      onOk: async () => {
                        const ok = await handleRemove(selectedRowsState);
                        if (ok) {
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                          Promise.resolve();
                        } else {
                          Promise.reject();
                        }
                      },
                    });
                  }}
                >
                  批量删除
                </Button>
              </PermissionGuard>
            </FooterToolbar>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};
