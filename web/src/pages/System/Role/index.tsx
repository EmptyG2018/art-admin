import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Divider,
  Space,
  message,
  Dropdown,
  Tooltip,
  Form,
  Tree,
  TreeProps,
  Popconfirm,
  Modal,
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
  ProFormSelect,
  ProFormDigit,
  ProFormTextArea,
  ProFormDependency,
  useToken,
} from '@ant-design/pro-components';
import { queryRolePage } from '@/services/role';
import CreateRoleForm from './components/CreateRoleForm';
import UpdateRoleForm from './components/UpdateRoleForm';
import UpdateRoleDeptForm from './components/UpdateRoleDeptForm';
import { queryDictsByType } from '@/services/dict';
import { queryMenuTree } from '@/services/menu';
import { queryDeptTree } from '@/services/dept';
import { deleteRole } from '@/services/role';
import { useControllableValue } from 'ahooks';

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
    await deleteRole(selectedRows.map((row) => row.roleId).join(','));
    hide();
    message.success('删除成功');
    return true;
  } catch {
    hide();
    message.error('删除失败请重试!');
    return false;
  }
};

interface NodeTreeProps extends TreeProps {
  defaultValue?: any[];
  value?: any[];
  request: any;
  onChange?: (e: any) => void;
}

const NodeTree: React.FC<NodeTreeProps> = ({
  request,
  defaultValue,
  value,
  onChange,
  ...rest
}) => {
  const { token } = useToken();
  const [treeData, setTreeData] = useState([]);
  const [state, setState] = useControllableValue<any[]>(
    { defaultValue, value, onChange },
    { defaultValue: [] },
  );

  useEffect(() => {
    if (!request) return;

    request().then((res) => {
      setTreeData(res);
    });
  }, [request]);

  const checkeds = useMemo(() => {
    return getLeafSelectedNodes(treeData, state);
  }, [treeData, state]);

  if (!treeData.length) return null;

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
        {...rest}
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
      width: 140,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      valueType: 'text',
      width: 140,
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      valueType: 'text',
      width: 180,
    },
    {
      title: '排序',
      dataIndex: 'roleSort',
      valueType: 'text',
      width: 120,
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
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => {
        if (record.roleKey === 'admin') return;
        return (
          <Space
            direction="horizontal"
            split={<Divider type="vertical" />}
            size={2}
          >
            <UpdateRoleForm
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
            <UpdateRoleDeptForm
              values={record}
              formRender={formRoleDeptRender}
              trigger={
                <Tooltip title="数据授权">
                  <Button
                    type="link"
                    size="small"
                    icon={<FileDoneOutlined />}
                  />
                </Tooltip>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
            <Tooltip title="授权用户">
              <Link to={`../role/${record.roleId}`}>
                <Button type="link" size="small" icon={<UserOutlined />} />
              </Link>
            </Tooltip>
          </Space>
        );
      },
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
        <NodeTree
          request={async () => {
            const res = await queryMenuTree();
            return res.data;
          }}
        />
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

  const formRoleDeptRender = (
    <>
      <ProFormText
        name="roleName"
        label="角色名称"
        placeholder="请输入角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
        width="md"
        disabled
      />
      <ProFormText
        name="roleKey"
        label="权限字符"
        placeholder="请输入权限字符"
        rules={[{ required: true, message: '请输入权限字符' }]}
        width="md"
        disabled
      />
      <ProFormSelect
        name="dataScope"
        label="权限范围"
        placeholder="请输入权限范围"
        width="sm"
        options={[
          { value: '1', label: '全部数据权限' },
          { value: '2', label: '自定数据权限' },
          { value: '3', label: '本部门数据权限' },
          { value: '4', label: '本部门及以下数据权限' },
          { value: '5', label: '仅本人数据权限' },
        ]}
      />
      <ProFormDependency name={['dataScope']}>
        {({ dataScope }) => {
          if (dataScope !== '2') return null;

          return (
            <Form.Item name="deptIds" label="菜单权限" initialValue={[]}>
              <NodeTree
                defaultExpandAll
                request={async () => {
                  const res = await queryDeptTree();
                  return res.data;
                }}
              />
            </Form.Item>
          );
        }}
      </ProFormDependency>
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
          defaultPageSize: 12,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        scroll={{ x: 1200 }}
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
    </PageContainer>
  );
};
