import {
  Button,
  Divider,
  Space,
  message,
  Dropdown,
  Tooltip,
  Form,
  Tree,
} from 'antd';
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  FileDoneOutlined,
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
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormTextArea,
  useToken,
} from '@ant-design/pro-components';

import React, { useMemo, useRef, useState } from 'react';
import { queryRolePage } from '@/services/role';
import CreateRoleForm from './components/CreateRoleForm';
import UpdateMenuForm from './components/UpdateRoleForm';
import { queryDictsByType } from '@/services/dict';
import { queryMenuTree } from '@/services/menu';
import { useRequest, useControllableValue } from 'ahooks';

interface TreeNode {
  id: number | string;
  children?: TreeNode[];
  // 其他字段如 title 等可选
}

/**
 * 从选中的节点 ID 中提取“最终叶子节点”（即：没有被选中的后代的选中节点）
 * @param tree 树形结构数组
 * @param selectedIds 选中的节点 ID 集合
 * @returns 最终叶子节点 ID 数组
 */
function getLeafSelectedNodes(
  tree: TreeNode[],
  selectedIds: (number | string)[],
): (number | string)[] {
  const selectedSet = new Set(selectedIds);
  const result: (number | string)[] = [];

  function traverse(node: TreeNode): boolean {
    const { id, children = [] } = node;

    if (!selectedSet.has(id)) {
      return false;
    }

    let hasSelectedDescendant = false;

    for (const child of children) {
      if (traverse(child)) {
        hasSelectedDescendant = true;
      }
    }

    if (!hasSelectedDescendant) {
      result.push(id);
    }

    return true;
  }

  // 遍历根节点
  for (const root of tree) {
    if (root && typeof root === 'object' && 'id' in root) {
      traverse(root);
    }
  }

  return result;
}

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

const MenuTree = (props) => {
  const { token } = useToken();
  const [state, setState] = useControllableValue<any[]>(props, {
    defaultValue: [],
  });
  const { data: treeData } = useRequest(async () => {
    const res = await queryMenuTree();
    return res.data;
  });

  const checkeds = useMemo(() => {
    if (!treeData) return [];

    return getLeafSelectedNodes(treeData, state);
  }, [treeData, state]);

  return (
    <div
      style={{
        maxWidth: 440,
        padding: token.paddingSM,
        overflow: 'auto',
        border: '1px solid ' + token.colorBorder,
        borderRadius: token.borderRadius,
      }}
    >
      <Tree
        checkedKeys={checkeds}
        treeData={treeData}
        fieldNames={{
          title: 'label',
          key: 'id',
          children: 'children',
        }}
        checkable
        onCheck={(v: any, { halfCheckedKeys }: any) => {
          setState([...new Set([...v, ...halfCheckedKeys])]);
        }}
      />
    </div>
  );
};

export const Component: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProColumns[] = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      hideInSearch: true,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      valueType: 'text',
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      valueType: 'text',
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
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
      valueType: 'dateTime',
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <UpdateMenuForm
            values={record}
            formRender={formRender}
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
            <Button type="link" size="small" icon={<DeleteOutlined />} />
          </Tooltip>
          <Tooltip title="数据授权">
            <Button type="link" size="small" icon={<FileDoneOutlined />} />
          </Tooltip>
          <Tooltip title="分配用户">
            <Button type="link" size="small" icon={<UserOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const formRender = (
    <>
      <ProFormText
        name="roleName"
        label="角色名称"
        placeholder="请输入角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
        width="md"
      />
      <ProFormText
        name="roleKey"
        label="权限字符"
        placeholder="请输入权限字符"
        rules={[{ required: true, message: '请输入权限字符' }]}
        width="md"
      />
      <Form.Item name="menuIds" label="菜单权限" initialValue={[]}>
        <MenuTree />
      </Form.Item>
      <ProFormDigit
        name="roleSort"
        label="排序"
        placeholder="请输入排序"
        min={1}
        rules={[{ required: true, message: '请输入排序' }]}
        width="xs"
        fieldProps={{ precision: 0 }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        placeholder="请选择状态"
        initialValue="0"
        options={[
          { label: '是', value: '0' },
          { label: '否', value: '1' },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
        request={async () => {
          const res = await queryDictsByType('sys_normal_disable');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        width="lg"
        placeholder="请输入备注"
      />
    </>
  );

  return (
    <PageContainer
      header={{
        title: '角色管理',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="roleId"
        toolBarRender={() => [
          <CreateRoleForm
            formRender={formRender}
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
            key="menu"
            menu={{
              items: [
                {
                  label: '导出',
                  icon: <ExportOutlined />,
                  key: 'export',
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
        request={async (params, sorter, filter) => {
          const { code, rows, total } = await queryRolePage({
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
    </PageContainer>
  );
};
