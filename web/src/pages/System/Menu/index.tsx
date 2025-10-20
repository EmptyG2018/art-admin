import React, { useRef } from 'react';
import { Button, Space, message, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { queryMenuList, queryMenuTree, deleteMenu } from '@/services/menu';
import { arrayToTree } from '@/utils/data';
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import CreateMenuForm from './components/CreateMenuForm';
import UpdateMenuForm from './components/UpdateMenuForm';
import icons from '@/constants/icons';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteMenu(selectedRows.map((row) => row.menuId).join(','));
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

  const columns: ProColumns[] = [
    {
      title: <T id="page.menu.field.menuName" />,
      dataIndex: 'menuName',
      valueType: 'text',
    },
    {
      title: <T id="page.menu.field.menuIcon" />,
      dataIndex: 'icon',
      valueType: 'text',
      width: 140,
      hideInSearch: true,
      render: (_, item) => {
        const Icon = icons[item.icon];
        return Icon ? <Icon /> : null;
      },
    },
    {
      title: <T id="page.menu.field.authKey" />,
      dataIndex: 'perms',
      valueType: 'text',
      width: 220,
      hideInSearch: true,
    },
    {
      title: <T id="component.field.sort" />,
      dataIndex: 'orderNum',
      valueType: 'text',
      width: 120,
      hideInSearch: true,
    },
    {
      title: <T id="component.field.status" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: <T id="dict.status.normal" />, status: 'MALE' },
        1: { text: <T id="dict.status.disable" />, status: 'FEMALE' },
      },
      width: 120,
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
      width: 140,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <PermissionGuard requireds={['system:menu:add']}>
            <CreateMenuForm
              values={{ parentId: record.menuId }}
              formRender={formRender}
              trigger={
                <Tooltip title={<T id="component.tooltip.add" />}>
                  <Button type="link" size="small" icon={<PlusOutlined />} />
                </Tooltip>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>
          <PermissionGuard requireds={['system:menu:edit']}>
            <UpdateMenuForm
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
          <PermissionGuard requireds={['system:menu:remove']}>
            <Popconfirm
              title={<T id="component.confirm.delete" />}
              description={<T id="component.confirm.delete.desc" />}
              onConfirm={async () => {
                await handleRemove([record]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <Tooltip title={<T id="component.tooltip.delete" />}>
                <Button type="link" size="small" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  const formRender = (
    <>
      <ProFormTreeSelect
        name="parentId"
        label={<T id="page.menu.field.menuParent" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.menu.field.menuParent'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder.sel', {
              label: t('page.menu.field.menuParent'),
            }),
          },
        ]}
        width="md"
        initialValue={0}
        fieldProps={{
          fieldNames: { label: 'label', value: 'id', children: 'children' },
        }}
        request={async () => {
          const res = await queryMenuTree();
          return [
            {
              id: 0,
              label: <T id="page.menu.root" />,
              children: arrayToTree(res.data, { keyField: 'id' }),
            },
          ];
        }}
      />
      <ProFormRadio.Group
        name="menuType"
        label={<T id="page.menu.field.menuType" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.menu.field.menuType'),
        })}
        initialValue="M"
        radioType="button"
        options={[
          { label: <T id="page.menu.type.option.m" />, value: 'M' },
          { label: <T id="page.menu.type.option.c" />, value: 'C' },
          { label: <T id="page.menu.type.option.f" />, value: 'F' },
        ]}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder.sel', {
              label: t('page.menu.field.menuType'),
            }),
          },
        ]}
      />
      <ProFormDependency name={['menuType']}>
        {({ menuType }) => (
          <>
            <ProForm.Group>
              <ProFormText
                name="menuName"
                label={<T id="page.menu.field.menuName" />}
                placeholder={t('component.form.placeholder', {
                  label: t('page.menu.field.menuName'),
                })}
                rules={[
                  {
                    required: true,
                    message: t('component.form.placeholder', {
                      label: t('page.menu.field.menuName'),
                    }),
                  },
                ]}
                width="md"
              />
              {['M'].includes(menuType) && (
                <ProFormSelect
                  name="icon"
                  label={<T id="page.menu.field.menuIcon" />}
                  placeholder={t('component.form.placeholder.sel', {
                    label: t('page.menu.field.menuIcon'),
                  })}
                  width="sm"
                  showSearch
                  fieldProps={{
                    optionRender: (option) => (
                      <Space>
                        {option.data.icon}
                        {option.data.label}
                      </Space>
                    ),
                  }}
                  options={Object.entries(icons).map(
                    ([key, IconComponent]) => ({
                      icon: <IconComponent />,
                      label: key,
                      value: key,
                    }),
                  )}
                />
              )}
              {['M', 'C'].includes(menuType) && (
                <ProFormText
                  name="i18nKey"
                  label={<T id="page.menu.field.i18nKey" />}
                  placeholder={t('component.form.placeholder', {
                    label: t('page.menu.field.i18nKey'),
                  })}
                  width="md"
                />
              )}
            </ProForm.Group>
            {['C'].includes(menuType) && (
              <ProFormRadio.Group
                name="isFrame"
                label={<T id="page.menu.field.isLink" />}
                placeholder={t('component.form.placeholder.sel', {
                  label: t('page.menu.field.isLink'),
                })}
                initialValue="1"
                options={[
                  { label: <T id="dict.status.true" />, value: '0' },
                  { label: <T id="dict.status.false" />, value: '1' },
                ]}
                rules={[
                  {
                    required: true,
                    message: t('component.form.placeholder.sel', {
                      label: t('page.menu.field.isLink'),
                    }),
                  },
                ]}
              />
            )}

            <ProForm.Group>
              {['M', 'C'].includes(menuType) && (
                <ProFormText
                  name="path"
                  label={<T id="page.menu.field.route" />}
                  placeholder={t('component.form.placeholder', {
                    label: t('page.menu.field.route'),
                  })}
                  rules={[
                    {
                      required: true,
                      message: t('component.form.placeholder', {
                        label: t('page.menu.field.route'),
                      }),
                    },
                  ]}
                  width="md"
                />
              )}
              {['C'].includes(menuType) && (
                <ProFormText
                  name="query"
                  label={<T id="page.menu.field.params" />}
                  placeholder={t('component.form.placeholder', {
                    label: t('page.menu.field.params'),
                  })}
                  width="md"
                />
              )}
              {['C'].includes(menuType) && (
                <ProFormText
                  name="component"
                  label={<T id="page.menu.field.component" />}
                  placeholder={t('component.form.placeholder', {
                    label: t('page.menu.field.component'),
                  })}
                  width="md"
                />
              )}
            </ProForm.Group>
            {['C', 'F'].includes(menuType) && (
              <ProFormText
                name="perms"
                label={<T id="page.menu.field.authKey" />}
                placeholder={t('component.form.placeholder', {
                  label: t('page.menu.field.authKey'),
                })}
                width="md"
              />
            )}
            <ProFormDigit
              name="orderNum"
              label={<T id="component.field.sort" />}
              placeholder={t('component.field.sort.placeholder')}
              min={1}
              rules={[
                {
                  required: true,
                  message: t('component.field.sort.placeholder'),
                },
              ]}
              width="xs"
              fieldProps={{ precision: 0 }}
            />
            {['C'].includes(menuType) && (
              <ProFormRadio.Group
                name="isCache"
                label={<T id="page.menu.field.isCache" />}
                placeholder={t('component.form.placeholder.sel', {
                  label: t('page.menu.field.isCache'),
                })}
                initialValue="0"
                options={[
                  { label: <T id="dict.status.true" />, value: '0' },
                  { label: <T id="dict.status.false" />, value: '1' },
                ]}
              />
            )}
            <ProForm.Group>
              {['M', 'C'].includes(menuType) && (
                <ProFormRadio.Group
                  name="visible"
                  label={<T id="page.menu.field.status.visible" />}
                  placeholder={t('component.form.placeholder.sel', {
                    label: t('page.menu.field.status.visible'),
                  })}
                  initialValue="0"
                  options={[
                    { label: <T id="dict.status.true" />, value: '0' },
                    { label: <T id="dict.status.false" />, value: '1' },
                  ]}
                  request={async () => {
                    const res = await queryDictsByType('sys_show_hide');
                    return res.data.map((dict) => ({
                      label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
                      value: dict.dictValue,
                    }));
                  }}
                />
              )}
              <ProFormRadio.Group
                name="status"
                label={<T id="page.menu.field.status.menu" />}
                placeholder={t('component.form.placeholder.sel', {
                  label: t('page.menu.field.status.menu'),
                })}
                initialValue="0"
                request={async () => {
                  const res = await queryDictsByType('sys_normal_disable');
                  return res.data.map((dict) => ({
                    label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
                    value: dict.dictValue,
                  }));
                }}
              />
            </ProForm.Group>
          </>
        )}
      </ProFormDependency>
    </>
  );

  return (
    <PageContainer
      header={{
        title: <T id="menu.system.menu" />,
      }}
    >
      <ProTable
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="menuId"
        toolBarRender={() => [
          <PermissionGuard requireds={['system:menu:add']}>
            <CreateMenuForm
              formRender={formRender}
              trigger={
                <Button type="primary" icon={<PlusOutlined />} key="add">
                  <T id="component.table.tool.add" />
                </Button>
              }
            />
          </PermissionGuard>,
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await queryMenuList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data,
            success: true,
          };
        }}
        postData={(rows: any) => {
          return arrayToTree(rows, { keyField: 'menuId' });
        }}
        columns={columns}
        pagination={false}
        scroll={{ x: 1400 }}
      />
    </PageContainer>
  );
};
