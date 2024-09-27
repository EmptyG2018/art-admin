import {
  Button,
  Divider,
  Space,
  Drawer,
  Input,
  Tree,
  Empty,
  message,
} from 'antd';
import type { TreeDataNode } from 'antd';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
  ProCard,
} from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { queryUserPage } from '@/services/user';
import { queryDeptTreeList } from '@/services/dept';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const DeptTree = () => {
  const { data: deptTree } = useRequest(queryDeptTreeList);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // const newExpandedKeys = dataList
    //   .map((item) => {
    //     if (item.title.indexOf(value) > -1) {
    //       return getParentKey(item.key, defaultData);
    //     }
    //     return null;
    //   })
    //   .filter(
    //     (item, i, self): item is React.Key =>
    //       !!(item && self.indexOf(item) === i),
    //   );
    // setExpandedKeys(newExpandedKeys);
    // setSearchValue(value);
    // setAutoExpandParent(true);
  };

  return (
    <>
      <Input.Search placeholder="请输入部门名称" onChange={onChange} />

      {!deptTree?.data ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Tree
          style={{ marginTop: 8 }}
          defaultExpandAll
          blockNode
          fieldNames={{
            key: 'id',
            title: 'label',
            children: 'children',
          }}
          treeData={deptTree.data}
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
  const columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
      hideInSearch: true,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: '正常', status: 'MALE' },
        1: { text: '停用', status: 'FEMALE' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
    },
    {
      title: '操作',
      width: 360,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space direction="horizontal" split={<Divider type="vertical" />}>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>
          <a href="">删除</a>
          <a href="">重置密码</a>
          <a href="">分配角色</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '用户管理',
      }}
    >
      <ProCard gutter={[16, 16]} ghost>
        <ProCard colSpan="300px" style={{ minHeight: 360 }}>
          <DeptTree />
        </ProCard>
        <ProCard>
          <ProTable
            headerTitle="查询表格"
            actionRef={actionRef}
            rowKey="userId"
            toolBarRender={() => [
              <Button
                key="add"
                type="primary"
                onClick={() => handleModalVisible(true)}
              >
                新建
              </Button>,
              <Button key="import" onClick={() => handleModalVisible(true)}>
                导入
              </Button>,
              <Button key="export" onClick={() => handleModalVisible(true)}>
                导出
              </Button>,
            ]}
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
                onClick={async () => {
                  await handleRemove(selectedRowsState);
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                批量删除
              </Button>
              <Button type="primary">批量审批</Button>
            </FooterToolbar>
          )}
        </ProCard>
      </ProCard>

      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
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
