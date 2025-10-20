import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
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
import { PermissionGuard } from '@/components/Layout';
import CreateRoleForm from './components/CreateRoleForm';
import UpdateRoleForm from './components/UpdateRoleForm';
import UpdateRoleDeptForm from './components/UpdateRoleDeptForm';
import { queryDictsByType } from '@/services/dict';
import { queryMenuTree } from '@/services/menu';
import { queryDeptTree } from '@/services/dept';
import { deleteRole } from '@/services/role';
import { rawT, useT, T } from '@/locales';
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
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteRole(selectedRows.map((row) => row.roleId).join(','));
    hide();
    message.success(rawT('component.form.message.delete.success'));
    return true;
  } catch {
    hide();
    message.error(rawT('component.form.message.delete.error'));
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
  const t = useT();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: <T id="page.role.field.id" />,
      dataIndex: 'roleId',
      hideInSearch: true,
      width: 140,
    },
    {
      title: <T id="page.role.field.roleName" />,
      dataIndex: 'roleName',
      valueType: 'text',
      width: 140,
    },
    {
      title: <T id="page.role.field.authKey" />,
      dataIndex: 'roleKey',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="component.field.sort" />,
      dataIndex: 'roleSort',
      valueType: 'text',
      width: 120,
      hideInSearch: true,
    },
    {
      title: <T id="component.field.status" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: t('dict.status.normal'), status: 'MALE' },
        1: { text: t('dict.status.disable'), status: 'FEMALE' },
      },
      width: 120,
    },
    {
      title: <T id="component.field.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: <T id="component.table.action" />,
      width: 180,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => {
        if (record.roleKey === 'admin') return;
        return (
          <Space direction="horizontal" size={16}>
            <PermissionGuard requireds={['system:role:edit']}>
              <UpdateRoleForm
                values={record}
                formRender={formRender}
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
            <PermissionGuard requireds={['system:role:remove']}>
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
            <PermissionGuard requireds={['system:role:edit']}>
              <UpdateRoleDeptForm
                values={record}
                formRender={formRoleDeptRender}
                trigger={
                  <Tooltip title={<T id="page.role.authData" />}>
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
            </PermissionGuard>
            <PermissionGuard requireds={['system:role:edit']}>
              <Tooltip title={<T id="page.role.authUser" />}>
                <Link to={`../role/${record.roleId}`}>
                  <Button type="link" size="small" icon={<UserOutlined />} />
                </Link>
              </Tooltip>
            </PermissionGuard>
          </Space>
        );
      },
    },
  ];

  const formRender = (
    <>
      <ProFormText
        name="roleName"
        label={<T id="page.role.field.roleName" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.role.field.roleName'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.role.field.roleName'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormText
        name="roleKey"
        label={<T id="page.role.field.authKey" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.role.field.authKey'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.role.field.authKey'),
            }),
          },
        ]}
        width="md"
      />
      <Form.Item
        name="menuIds"
        label={<T id="page.role.field.authMenu" />}
        initialValue={[]}
      >
        <NodeTree
          request={async () => {
            const res = await queryMenuTree();
            return res.data;
          }}
        />
      </Form.Item>
      <ProFormDigit
        name="roleSort"
        label={<T id="component.field.sort" />}
        placeholder={t('component.form.placeholder', {
          label: t('component.field.sort'),
        })}
        min={1}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('component.field.sort'),
            }),
          },
        ]}
        width="xs"
        fieldProps={{ precision: 0 }}
      />
      <ProFormRadio.Group
        name="status"
        label={<T id="component.field.status" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('component.field.status'),
        })}
        initialValue="0"
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('component.field.status'),
            }),
          },
        ]}
        request={async () => {
          const res = await queryDictsByType('sys_normal_disable');
          return res.data.map((dict) => ({
            label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
      <ProFormTextArea
        name="remark"
        label={<T id="component.field.remark" />}
        width="lg"
        placeholder={t('component.form.placeholder', {
          label: t('component.field.remark'),
        })}
      />
    </>
  );

  const formRoleDeptRender = (
    <>
      <ProFormText
        name="roleName"
        label={<T id="page.role.field.roleName" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.role.field.roleName'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.role.field.roleName'),
            }),
          },
        ]}
        width="md"
        disabled
      />
      <ProFormText
        name="roleKey"
        label={<T id="page.role.field.authKey" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.role.field.authKey'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.role.field.authKey'),
            }),
          },
        ]}
        width="md"
        disabled
      />
      <ProFormSelect
        name="dataScope"
        label={<T id="page.role.field.authScope" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.role.field.authScope'),
        })}
        width="sm"
        options={[
          { value: '1', label: t('dict.option.authScope.all') },
          { value: '2', label: t('dict.option.authScope.diy') },
          { value: '3', label: t('dict.option.authScope.deptSelf') },
          { value: '4', label: t('dict.option.authScope.deptBelow') },
          { value: '5', label: t('dict.option.authScope.onlyMe') },
        ]}
      />
      <ProFormDependency name={['dataScope']}>
        {({ dataScope }) => {
          if (dataScope !== '2') return null;

          return (
            <Form.Item
              name="deptIds"
              label={<T id="page.role.field.authMenu" />}
              initialValue={[]}
            >
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
        title: <T id="menu.system.role" />,
      }}
    >
      <ProTable
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="roleId"
        toolBarRender={() => [
          <PermissionGuard requireds={['system:role:add']} key="add">
            <CreateRoleForm
              formRender={formRender}
              trigger={
                <Button type="primary" icon={<PlusOutlined />}>
                  <T id="component.table.tool.add" />
                </Button>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: <T id="component.table.tool.export" />,
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
          <PermissionGuard requireds={['system:role:remove']}>
            <Button
              onClick={async () => {
                Modal.confirm({
                  title: t('component.confirm.delete'),
                  content: t('component.confirm.delete.select.desc'),
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
    </PageContainer>
  );
};
