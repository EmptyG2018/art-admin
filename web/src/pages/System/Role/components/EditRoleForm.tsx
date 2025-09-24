import { Form, Tree } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormRadio,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { queryMenuTree } from '@/services/menu';

interface EditRoleFormProps {
  formDisabled?: boolean;
  title: string;
  values: any;
  trigger: JSX.Element;
  onFinish?: () => void;
}

const EditRoleForm: React.FC<EditRoleFormProps> = (props) => {
  const { title, trigger, onFinish } = props;

  return (
    <ModalForm
      title={title}
      trigger={trigger}
      rowProps={{ gutter: 16 }}
      modalProps={{
        destroyOnHidden: true,
      }}
      onFinish={(formValues) => {
        console.log(formValues);
      }}
    >
      <ProFormText width="md" name="roleNmae" label="角色名称" />
      <ProFormText name="roleKey" label="角色名称" />
      <ProFormDigit name="roleSort" label="角色排序" />
      <ProFormRadio.Group
        name="status"
        label="状态"
        placeholder="请选择状态"
        request={async () => {
          const res = await queryDictsByType('sys_normal_disable');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
      <ProFormTreeSelect
      initialValue={[2]}
        name="menuIds"
        label="菜单权限"
        fieldProps={{
          multiple: true,
          fieldNames: {
            label: 'label',
            value: 'id',
            children: 'children',
          },
          treeCheckable: true,
          showCheckedStrategy: 'SHOW_ALL',
        }}
        request={async () => {
          const res = await queryMenuTree();
          return res.data;
        }}
      />
      <ProFormTextArea name="remark" label="备注" />
    </ModalForm>
  );
};

export default EditRoleForm;
