import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Space,
  Tooltip,
  message,
  Dropdown,
  Popconfirm,
  Modal,
  Badge,
} from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
  ProColumns,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import {
  queryDictPage,
  queryDictsByType,
  getDictType,
  deleteDict,
} from '@/services/dict';
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import CreateDictDataForm from './components/CreateDictDataForm';
import UpdateDictDataForm from './components/UpdateDictDataForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteDict(selectedRows.map((row) => row.dictCode).join(','));
    hide();
    message.success(rawT('component.form.message.delete.success'));
    return true;
  } catch {
    hide();
    message.success(rawT('component.form.message.delete.error'));
    return false;
  }
};

interface TableListProps {
  dictType: string;
}

const TableList: React.FC<TableListProps> = (props) => {
  const t = useT();
  const { dictType } = props;
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: <T id="page.dict.field.id" />,
      dataIndex: 'dictCode',
      width: 140,
      hideInSearch: true,
    },
    {
      title: <T id="page.dict.field.dictLabel" />,
      dataIndex: 'dictLabel',
      valueType: 'text',
      width: 140,
    },
    {
      title: <T id="page.dict.field.dictValue" />,
      dataIndex: 'dictValue',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="component.field.sort" />,
      dataIndex: 'dictSort',
      valueType: 'digit',
      width: 120,
      initialValue: 0,
      hideInSearch: true,
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
      title: <T id="component.field.remark" />,
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <T id="component.field.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
      hideInSearch: true,
    },
    {
      title: <T id="component.table.action" />,
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <PermissionGuard requireds={['system:dict:edit']}>
            <UpdateDictDataForm
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
          <PermissionGuard requireds={['system:dict:remove']}>
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
        </Space>
      ),
    },
  ];

  const formRender = (
    <>
      <ProFormText
        name="dictLabel"
        label={<T id="page.dict.field.dictLabel" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.dict.field.dictLabel'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.dict.field.dictLabel'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormText
        name="dictValue"
        label={<T id="page.dict.field.dictValue" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.dict.field.dictValue'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.dict.field.dictValue'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormText
        name="i18nKey"
        label={<T id="page.dict.field.i18nKey" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.dict.field.i18nKey'),
        })}
        tooltip={<T id="page.dict.field.i18nKey.tooltip" />}
        width="md"
      />
      <ProFormText
        name="cssClass"
        label={<T id="page.dict.field.class" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.dict.field.class'),
        })}
        width="md"
      />
      <ProFormSelect
        name="listClass"
        label={<T id="page.dict.field.style" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.dict.field.style'),
        })}
        valueEnum={{
          Default: {
            text: <T id="page.dict.style.option.default" />,
            status: 'Default',
          },
          Processing: {
            text: <T id="page.dict.style.option.processing" />,
            status: 'Processing',
          },
          Success: {
            text: <T id="page.dict.style.option.success" />,
            status: 'Success',
          },
          Warning: {
            text: <T id="page.dict.style.option.warning" />,
            status: 'Warning',
          },
          Error: {
            text: <T id="page.dict.style.option.error" />,
            status: 'Error',
          },
        }}
        fieldProps={{
          optionRender: (option) => {
            const statusMap = {
              Default: 'default',
              Processing: 'processing',
              Success: 'success',
              Warning: 'warning',
              Error: 'error',
            };

            return (
              <Badge
                offset={[4, 0]}
                status={statusMap[option.value] || ''}
                text={option.label}
              />
            );
          },
        }}
        width="md"
      />
      <ProFormDigit
        name="dictSort"
        label={<T id="component.field.sort" />}
        placeholder={t('component.field.sort.placeholder')}
        min={0}
        fieldProps={{ precision: 0 }}
        rules={[
          { required: true, message: t('component.field.sort.placeholder') },
        ]}
        width="xs"
      />
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
      />
      <ProFormTextArea
        name="remark"
        label={<T id="component.field.remark" />}
        width="lg"
        placeholder={t('component.field.remark.placeholder')}
      />
    </>
  );

  return (
    <>
      <ProTable
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="dictCode"
        toolBarRender={() => [
          <PermissionGuard requireds={['system:dict:add']}>
            <CreateDictDataForm
              values={{ dictType }}
              formRender={formRender}
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
        request={async (params, sorter, filter) => {
          const { code, rows, total } = await queryDictPage({
            dictType,
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
          <PermissionGuard requireds={['system:dict:remove']}>
            <Button
              onClick={async () => {
                Modal.confirm({
                  title: t('component.confirm.delete'),
                  content: t('component.confirm.delete.desc'),
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
    </>
  );
};

export const Component: React.FC<unknown> = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { loading, data } = useRequest(
    async () => {
      const res = await getDictType(params.dictId);
      return res.data;
    },
    {
      refreshDeps: [params.dictId],
    },
  );

  const columns: ProColumns[] = [
    {
      title: <T id="page.dict.field.id" />,
      dataIndex: 'dictId',
    },
    {
      title: <T id="page.dict.field.dictName" />,
      dataIndex: 'dictName',
      valueType: 'text',
    },
    {
      title: <T id="page.dict.field.dictType" />,
      dataIndex: 'dictType',
      valueType: 'text',
    },
    {
      title: <T id="component.field.status" />,
      dataIndex: 'status',
      valueType: 'radio',
      request: async () => {
        const res = await queryDictsByType('sys_normal_disable');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: <T id="component.field.remark" />,
      dataIndex: 'remark',
      valueType: 'textarea',
    },
    {
      title: <T id="component.field.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer
      header={{
        title: '字典数据',
      }}
      content={
        <ProDescriptions
          columns={columns}
          column={{ sm: 1, md: 2, lg: 2, xl: 2 }}
          loading={loading}
          dataSource={data}
        />
      }
      onBack={() => navigate(-1)}
    >
      {!!data?.dictType && <TableList dictType={data.dictType} />}
    </PageContainer>
  );
};
