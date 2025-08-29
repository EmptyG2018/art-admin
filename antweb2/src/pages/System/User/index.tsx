import {
  Button,
  Divider,
  Space,
  Drawer,
  Tree,
  Empty,
  message,
  Tooltip,
  Row,
  Col,
} from 'antd';
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { queryUserPage } from '@/services/user';
import { queryDeptTreeList } from '@/services/dept';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';

const DeptTree = ({ onSelect }: { onSelect: (key: React.Key) => void }) => {
  const { data: deptTree } = useRequest(queryDeptTreeList);

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
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const [deptId, setDeptId] = useState<React.Key>();

  const columns: ProColumns[] = [
    {
      title: '用户编号',
      width: 160,
      dataIndex: 'userId',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '用户名称',
      width: 220,
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户昵称',
      width: 220,
      dataIndex: 'nickName',
      valueType: 'text',
      hideInSearch: true,
      formItemProps: {
        required: true,
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '所属部门',
      width: 160,
      dataIndex: 'deptName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '用户密码',
      dataIndex: 'password',
      valueType: 'password',
      hideInSearch: true,
      hideInTable: true,
      formItemProps: {
        required: true,
      },
    },
    {
      title: '性别',
      width: 120,
      dataIndex: 'sex',
      valueType: 'select',
      hideInSearch: true,
      hideInTable: true,
      valueEnum: {
        0: { text: '男' },
        1: { text: '女' },
      },
    },
    {
      title: '状态',
      width: 120,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: '正常', status: 'Processing' },
        1: { text: '停用', status: 'Error' },
      },
    },
    {
      title: '岗位',
      width: 120,
      dataIndex: 'postId',
      valueType: 'select',
      valueEnum: {
        0: { text: '正常', status: 'Processing' },
        1: { text: '停用', status: 'Error' },
      },
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '角色',
      width: 120,
      dataIndex: 'roleId',
      valueType: 'select',
      valueEnum: {
        0: { text: '正常', status: 'Processing' },
        1: { text: '停用', status: 'Error' },
      },
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '创建时间',
      width: 220,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInForm: true,
    },
    {
      title: '备注',
      width: 220,
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
      colSize: 2,
    },
    {
      title: '操作',
      width: 120,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <Tooltip title="修改">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="link" size="small" icon={<DeleteOutlined />} />
          </Tooltip>
          <Tooltip title="重置密码">
            <Button type="link" size="small" icon={<KeyOutlined />} />
          </Tooltip>
          <Tooltip title="分配角色">
            <Button type="link" size="small" icon={<UserOutlined />} />
          </Tooltip>
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
              <Button
                type="primary"
                key="add"
                onClick={() => handleModalVisible(true)}
              >
                新建
              </Button>,
              <Button
                icon={<ImportOutlined />}
                key="import"
                onClick={() => handleModalVisible(true)}
              />,
              <Button
                icon={<ExportOutlined />}
                key="export"
                onClick={() => handleModalVisible(true)}
              />,
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
                  await handleRemove(selectedRowsState);
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                批量删除
              </Button>
            </FooterToolbar>
          )}
        </Col>
      </Row>

      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable
          rowKey="id"
          type="form"
          columns={columns}
          form={{
            layout: 'horizontal',
            grid: true,
            labelCol: { span: 8 },
            colProps: {
              span: 12,
            },
            rowProps: {
              gutter: 16,
            },
          }}
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<API.UserInfo>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
