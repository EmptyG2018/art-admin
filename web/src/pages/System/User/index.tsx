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
import { rawT, useT, T } from '@/locales';
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
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteUser(selectedRows.map((row) => row.userId).join(','));
    hide();
    message.success(rawT('component.form.message.delete.success'));
    return true;
  } catch {
    hide();
    message.error(rawT('component.form.message.delete.error'));
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const [deptId, setDeptId] = useState<React.Key>();
  const responsive = useResponsive();
  const t = useT();

  const columns: ProColumns[] = [
    {
      title: <T id="page.user.field.id" />,
      dataIndex: 'userId',
      width: 120,
      hideInSearch: true,
    },
    {
      title: <T id="page.user.field.nickName" />,
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
      title: <T id="page.user.field.dept" />,
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
      title: <T id="page.user.field.userName" />,
      dataIndex: 'userName',
      valueType: 'text',
      width: 220,
    },
    {
      title: <T id="component.field.status" />,
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
      title: <T id="component.field.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: <T id="component.table.action" />,
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
                  <Tooltip title={<T id="component.tooltip.update" />}>
                    <Button type="link" size="small" icon={<EditOutlined />} />
                  </Tooltip>
                }
                onFinish={() => {
                  actionRef.current?.reload();
                }}
              />
            </PermissionGuard>
            <PermissionGuard requireds={['system:user:remove']}>
              <Tooltip title={<T id="component.tooltip.delete" />}>
                <Popconfirm
                  title={<T id="component.confirm.delete" />}
                  description={<T id="component.confirm.delete.desc" />}
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
                title={<T id="page.user.restPswd" />}
                width={400}
                trigger={
                  <Tooltip title={<T id="page.user.restPswd" />}>
                    <Button type="link" size="small" icon={<KeyOutlined />} />
                  </Tooltip>
                }
                modalProps={{
                  destroyOnHidden: true,
                }}
                onFinish={async (formValues) => {
                  const hide = message.loading(t('page.user.restPswd.loading'));
                  try {
                    await resetUserPwd({
                      ...formValues,
                      userId: record.userId,
                    });
                    hide();
                    message.success(t('page.user.restPswd.success'));
                    return true;
                  } catch {
                    hide();
                    message.error(t('page.user.restPswd.error'));
                    return false;
                  }
                }}
              >
                <ProFormText.Password
                  name="password"
                  label={<T id="page.user.field.newPswd" />}
                  placeholder={t('component.form.placeholder', {
                    label: t('page.user.field.newPswd'),
                  })}
                  rules={[
                    {
                      required: true,
                      message: t('component.form.placeholder', {
                        label: t('page.user.field.newPswd'),
                      }),
                    },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
                      message: t('page.user.field.newPswd.rule'),
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
      <ProForm.Group title={<T id="page.user.group.base" />}>
        {souce === 'add' && (
          <ProFormText
            name="userName"
            label={<T id="page.user.field.user" />}
            placeholder={t('component.form.placeholder', {
              label: t('page.user.field.user'),
            })}
            rules={[
              {
                required: true,
                message: t('component.form.placeholder', {
                  label: t('page.user.field.user'),
                }),
              },
              {
                min: 2,
                message: t('page.user.field.user.rule'),
              },
            ]}
            width="md"
          />
        )}
        <ProFormText
          name="nickName"
          label={<T id="page.user.field.nickName" />}
          placeholder={t('component.form.placeholder', {
            label: t('page.user.field.nickName'),
          })}
          rules={[
            {
              required: true,
              message: t('component.form.placeholder', {
                label: t('page.user.field.nickName'),
              }),
            },
            {
              min: 2,
              message: t('page.user.field.nickName.rule'),
            },
          ]}
          width="md"
        />
        <ProFormText
          name="phonenumber"
          label={<T id="page.user.field.phone" />}
          placeholder={t('component.form.placeholder', {
            label: t('page.user.field.phone'),
          })}
          rules={[
            {
              pattern: /^1[3-9]\d{9}$/,
              message: t('page.user.field.phone.rule'),
            },
          ]}
          width="md"
        />
        <ProFormText
          name="email"
          label={<T id="page.user.field.email" />}
          placeholder={t('component.form.placeholder', {
            label: t('page.user.field.email'),
          })}
          rules={[
            {
              type: 'email',
              message: t('page.user.field.email.rule'),
            },
          ]}
          width="md"
        />
        <ProFormSelect
          name="sex"
          label={<T id="page.user.field.sex" />}
          placeholder={t('component.form.placeholder.sel', {
            label: t('page.user.field.sex'),
          })}
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

      <ProForm.Group title={<T id="page.user.group.auth" />}>
        <ProFormTreeSelect
          name="deptId"
          label={<T id="page.user.field.dept" />}
          placeholder={t('component.form.placeholder.sel', {
            label: t('page.user.field.dept'),
          })}
          rules={[
            {
              required: true,
              message: t('component.form.placeholder.sel', {
                label: t('page.user.field.dept'),
              }),
            },
          ]}
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
          label={<T id="page.user.field.post" />}
          placeholder={t('component.form.placeholder', {
            label: t('page.user.field.post'),
          })}
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
          label={<T id="page.user.field.role" />}
          placeholder={t('component.form.placeholder', {
            label: t('page.user.field.role'),
          })}
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
          label={<T id="page.user.field.pswd" />}
          placeholder={t('component.form.placeholder', {
            label: t('page.user.field.pswd'),
          })}
          rules={[
            {
              required: true,
              message: t('component.form.placeholder', {
                label: t('page.user.field.pswd'),
              }),
            },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
              message: t('page.user.field.pswd.rule'),
            },
          ]}
          width="xl"
        />
      )}
      <ProFormRadio.Group
        name="status"
        label={<T id="component.field.status" />}
        placeholder={t('component.field.status.placeholder')}
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
      <ProFormTextArea
        name="remark"
        label={<T id="component.field.remark" />}
        placeholder={t('component.field.remark.placeholder')}
      />
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
            headerTitle={<T id="component.table.title" />}
            actionRef={actionRef}
            rowKey="userId"
            toolBarRender={() => [
              <PermissionGuard requireds={['system:user:add']}>
                <CreateUserForm
                  formRender={formRender('add')}
                  trigger={
                    <Button type="primary" icon={<PlusOutlined />} key="add">
                      <T id="component.table.tool.add" />
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
                      label: <T id="component.table.tool.import" />,
                      icon: <ImportOutlined />,
                      key: 'import',
                    },
                    {
                      label: <T id="component.table.tool.export" />,
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
                  <T
                    id="component.table.selection"
                    values={{
                      num: (
                        <a style={{ fontWeight: 600 }}>
                          {selectedRowsState.length}
                        </a>
                      ),
                    }}
                  />
                </div>
              }
            >
              <PermissionGuard requireds={['system:user:remove']}>
                <Button
                  onClick={async () => {
                    Modal.confirm({
                      title: <T id="component.confirm.delete" />,
                      content: <T id="component.confirm.delete.select.desc" />,
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
                  <T id="component.table.tool.batchdelete" />
                </Button>
              </PermissionGuard>
            </FooterToolbar>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};
