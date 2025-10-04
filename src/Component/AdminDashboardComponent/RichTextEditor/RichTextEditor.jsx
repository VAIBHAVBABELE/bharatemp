import React, { useRef, useState } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = "Enter content..." }) => {
  const editorRef = useRef(null);
  const [isActive, setIsActive] = useState({});

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateActiveStates();
  };

  const updateActiveStates = () => {
    const newStates = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
    };
    setIsActive(newStates);
  };

  const handleInput = () => {
    const content = editorRef.current.innerHTML;
    onChange(content);
    updateActiveStates();
  };

  const handleKeyUp = () => {
    updateActiveStates();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const styles = {
    container: {
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: 'white',
      overflow: 'hidden',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      gap: '4px',
      flexWrap: 'wrap',
    },
    select: {
      padding: '4px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      marginRight: '8px',
    },
    button: {
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    buttonActive: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderColor: '#3b82f6',
    },
    separator: {
      width: '1px',
      height: '24px',
      backgroundColor: '#d1d5db',
      margin: '0 4px',
    },
    editor: {
      minHeight: '300px',
      padding: '12px',
      outline: 'none',
      fontSize: '14px',
      lineHeight: '1.6',
      fontFamily: 'inherit',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <select
          style={styles.select}
          onChange={(e) => {
            if (e.target.value) {
              execCommand('formatBlock', `<${e.target.value}>`);
            } else {
              execCommand('formatBlock', '<div>');
            }
          }}
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        <select
          style={styles.select}
          onChange={(e) => execCommand('fontName', e.target.value)}
        >
          <option value="">Sans Serif</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>

        <button
          style={{
            ...styles.button,
            ...(isActive.bold ? styles.buttonActive : {}),
            fontWeight: 'bold',
          }}
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          B
        </button>

        <button
          style={{
            ...styles.button,
            ...(isActive.italic ? styles.buttonActive : {}),
            fontStyle: 'italic',
          }}
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          I
        </button>

        <button
          style={{
            ...styles.button,
            ...(isActive.underline ? styles.buttonActive : {}),
            textDecoration: 'underline',
          }}
          onClick={() => execCommand('underline')}
          title="Underline"
        >
          U
        </button>

        <button
          style={styles.button}
          onClick={() => {
            const color = prompt('Enter color (hex):');
            if (color) execCommand('foreColor', color);
          }}
          title="Text Color"
        >
          A
        </button>

        <button
          style={styles.button}
          onClick={() => {
            const color = prompt('Enter background color (hex):');
            if (color) execCommand('backColor', color);
          }}
          title="Background Color"
        >
          🎨
        </button>

        <div style={styles.separator}></div>

        <button
          style={{
            ...styles.button,
            ...(isActive.insertOrderedList ? styles.buttonActive : {}),
          }}
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
        >
          1.
        </button>

        <button
          style={{
            ...styles.button,
            ...(isActive.insertUnorderedList ? styles.buttonActive : {}),
          }}
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >
          •
        </button>

        <button
          style={{
            ...styles.button,
            ...(isActive.justifyLeft ? styles.buttonActive : {}),
          }}
          onClick={() => execCommand('justifyLeft')}
          title="Align Left"
        >
          ⬅
        </button>

        <button
          style={{
            ...styles.button,
            ...(isActive.justifyCenter ? styles.buttonActive : {}),
          }}
          onClick={() => execCommand('justifyCenter')}
          title="Align Center"
        >
          ↔
        </button>

        <button
          style={{
            ...styles.button,
            ...(isActive.justifyRight ? styles.buttonActive : {}),
          }}
          onClick={() => execCommand('justifyRight')}
          title="Align Right"
        >
          ➡
        </button>

        <div style={styles.separator}></div>

        <button
          style={styles.button}
          onClick={insertLink}
          title="Insert Link"
        >
          🔗
        </button>

        <button
          style={styles.button}
          onClick={insertImage}
          title="Insert Image"
        >
          🖼
        </button>

        <button
          style={styles.button}
          onClick={() => execCommand('formatBlock', '<pre>')}
          title="Code Block"
        >
          &lt;/&gt;
        </button>

        <button
          style={styles.button}
          onClick={() => execCommand('removeFormat')}
          title="Clear Formatting"
        >
          🧹
        </button>
      </div>

      <div
        ref={editorRef}
        style={styles.editor}
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onKeyUp={handleKeyUp}
        onMouseUp={updateActiveStates}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;