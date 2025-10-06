import React, { useRef, useState, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = "Enter content..." }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(value || '');

  // Update content when value prop changes
  useEffect(() => {
    if (value !== content) {
      setContent(value || '');
      if (editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
    }
  };

  const handleInput = () => {
    handleContentChange();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleContentChange();
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
      borderRadius: '8px',
      backgroundColor: 'white',
      overflow: 'hidden',
      fontFamily: 'inherit',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      gap: '8px',
      flexWrap: 'wrap',
    },
    select: {
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    button: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      color: '#374151',
    },
    buttonHover: {
      backgroundColor: '#f3f4f6',
      borderColor: '#9ca3af',
    },
    separator: {
      width: '1px',
      height: '24px',
      backgroundColor: '#d1d5db',
      margin: '0 4px',
    },
    editor: {
      minHeight: '300px',
      maxHeight: '500px',
      padding: '16px',
      outline: 'none',
      fontSize: '14px',
      lineHeight: '1.6',
      fontFamily: 'inherit',
      overflow: 'auto',
      backgroundColor: 'white',
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
            }
            e.target.value = '';
          }}
          defaultValue=""
        >
          <option value="">Format</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="p">Paragraph</option>
        </select>

        <button
          style={styles.button}
          onClick={() => execCommand('bold')}
          title="Bold (Ctrl+B)"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          <strong>B</strong>
        </button>

        <button
          style={styles.button}
          onClick={() => execCommand('italic')}
          title="Italic (Ctrl+I)"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          <em>I</em>
        </button>

        <button
          style={styles.button}
          onClick={() => execCommand('underline')}
          title="Underline (Ctrl+U)"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          <u>U</u>
        </button>

        <div style={styles.separator}></div>

        <button
          style={styles.button}
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          1.
        </button>

        <button
          style={styles.button}
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          •
        </button>

        <div style={styles.separator}></div>

        <button
          style={styles.button}
          onClick={() => execCommand('justifyLeft')}
          title="Align Left"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          ⬅
        </button>

        <button
          style={styles.button}
          onClick={() => execCommand('justifyCenter')}
          title="Align Center"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          ↔
        </button>

        <button
          style={styles.button}
          onClick={() => execCommand('justifyRight')}
          title="Align Right"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          ➡
        </button>

        <div style={styles.separator}></div>

        <button
          style={styles.button}
          onClick={insertLink}
          title="Insert Link"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          🔗
        </button>

        <button
          style={styles.button}
          onClick={insertImage}
          title="Insert Image"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          🖼
        </button>

        <button
          style={styles.button}
          onClick={() => execCommand('removeFormat')}
          title="Clear Formatting"
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        >
          🧹
        </button>
      </div>

      <div
        ref={editorRef}
        style={styles.editor}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: content }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;