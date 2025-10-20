import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { updateMenu, getMenu } from '@/services/menu';

interface UpdateMenuFormProps {
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateMenuForm: React.FC<UpdateMenuFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { values, trigger, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={
        <T
          id="component.form.update"
          values={{ title: <T id="page.menu.title" /> }}
        />
      }
      request={async () => {
        const res = await getMenu(values.menuId);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading(
          t('component.form.message.update.loading'),
        );
        try {
          await updateMenu({ ...values, ...formValues });
          onFinish?.();
          hide();
          message.success(t('component.form.message.update.success'));
          return true;
        } catch {
          hide();
          message.success(t('component.form.message.update.error'));
          return false;
        }
      }}
    />
  );
};

export default UpdateMenuForm;
