import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';

interface WangEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const wangEditorStyle = {
  border: '1px solid #d9d9d9',
  borderRadius: '6px',
  overflow: 'hidden',
};

const WangEditor: React.FC<WangEditorProps> = ({ value, onChange }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const toolbarConfig: Partial<IToolbarConfig> = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  };

  useEffect(() => {
    return () => {
      if (editor == null) return;

      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={wangEditorStyle}>
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" />
        <Editor
          style={{ height: '360px' }}
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={(editor) => onChange?.(editor.getHtml())}
          mode="default"
        />
      </div>
    </>
  );
};

export default WangEditor;
