import React, { useRef, useState } from 'react';
import {
  Button,
  Space,
  message,
  Dropdown,
  Tooltip,
  Popconfirm,
  Modal,
} from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { queryConfigPage, deleteConfig } from '@/services/config';
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import CreateConfigForm from './components/CreateConfigForm';
import UpdateConfigForm from './components/UpdateConfigForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteConfig(selectedRows.map((row) => row.configId).join(','));
    hide();
    message.success(rawT('component.form.message.delete.success'));
    return true;
  } catch {
    hide();
    message.success(rawT('component.form.message.delete.error'));
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const t = useT();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: <T id="page.config.field.id" />,
      dataIndex: 'configId',
      hideInSearch: true,
      width: 140,
    },
    {
      title: <T id="page.config.field.configName" />,
      dataIndex: 'configName',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.config.field.configKey" />,
      dataIndex: 'configKey',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.config.field.configValue" />,
      dataIndex: 'configValue',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="page.config.field.isSys" />,
      dataIndex: 'configType',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_yes_no');
        return res.data.map((dict) => ({
          label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
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
    },
    {
      title: <T id="component.table.action" />,
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <PermissionGuard requireds={['system:config:edit']}>
            <UpdateConfigForm
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
          <PermissionGuard requireds={['system:config:remove']}>
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
        name="configName"
        label={<T id="page.config.field.configName" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.config.field.configName'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.config.field.configName'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormText
        name="configKey"
        label={<T id="page.config.field.configKey" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.config.field.configKey'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.config.field.configKey'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormText
        name="configValue"
        label={<T id="page.config.field.configValue" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.config.field.configValue'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.config.field.configValue'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormRadio.Group
        name="configType"
        label={<T id="page.config.field.isSys" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.config.field.isSys'),
        })}
        initialValue="Y"
        request={async () => {
          const res = await queryDictsByType('sys_yes_no');
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
        placeholder={t('component.field.remark.placeholder')}
      />
    </>
  );

  return (
    <PageContainer
      header={{
        title: <T id="menu.system.config" />,
      }}
    >
      <ProTable
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="configId"
        toolBarRender={() => [
          <PermissionGuard requireds={['system:config:add']}>
            <CreateConfigForm
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
          <Button
            icon={<ReloadOutlined />}
            key="refresh"
            onClick={() => handleModalVisible(true)}
          >
            <T id="page.config.refresh" />
          </Button>,
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
          const { code, rows, total } = await queryConfigPage({
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
        scroll={{ x: 1400 }}
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
          <PermissionGuard requireds={['system:config:remove']}>
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
    </PageContainer>
  );
};
