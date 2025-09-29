import {
  Button,
  Divider,
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
  UserOutlined,
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
  ProFormText,
} from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { queryUserPage, deleteUser, resetUserPwd } from '@/services/user';
import { queryDeptTree } from '@/services/dept';
import { queryDictsByType } from '@/services/dict';
import CreateUserForm from './components/CreateUserForm';
import UpdateUserForm from './components/UpdateUserForm';

const DeptTree = ({ onSelect }: { onSelect: (key: React.Key) => void }) => {
  const { data: deptTree } = useRequest(queryDeptTree);

  return (
    <>
      {!deptTree?.data ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Tree<any>
          style={{ marginTop: 8 }}
          defaultExpandAll
          blockNode
          fieldNames={{
            key: 'id',
            title: 'label',
            children: 'children',
          }}
          treeData={deptTree.data}
          onSelect={(selectedKeys) => {
            onSelect && onSelect(selectedKeys[0]);
          }}
        />
      )}
    </>
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
        <UpdateUserForm formDisabled values={record} trigger={<a>{text}</a>} />
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
      title: '手机号码',
      dataIndex: 'phonenumber',
      valueType: 'text',
      width: 220,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      width: 280,
      hideInSearch: true,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      valueType: 'text',
      width: 220,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueType: 'radio',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_user_sex');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radio',
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
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <UpdateUserForm
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
                await resetUserPwd({ ...formValues, userId: record.userId });
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
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Row wrap={false} gutter={16}>
        <Col flex="220px" style={{ minHeight: 360 }}>
          <DeptTree onSelect={setDeptId} />
        </Col>
        <Col flex="auto">
          <ProTable
            headerTitle="查询表格"
            actionRef={actionRef}
            rowKey="userId"
            toolBarRender={() => [
              <CreateUserForm
                trigger={
                  <Button type="primary" icon={<PlusOutlined />} key="add">
                    新增
                  </Button>
                }
                onFinish={() => {
                  actionRef.current?.reload();
                }}
              />,
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
              current: 1,
              pageSize: 15,
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
              <Button
                type="primary"
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
            </FooterToolbar>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};
