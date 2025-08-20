// import { $getRoot, $getSelection } from 'lexical'
// import { useEffect } from 'react'
//
import styles from './Style.module.css'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import ToolbarPlugin from './plugins/ToolbarPlugin'

const theme = {
  // Theme styling goes here
  //...
}

//捕捉异常
function onError(error) {
  console.error(error)
}

export default function LexicalEditor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={styles.editorContainer}>
        <div>
          <ToolbarPlugin />
        </div>
        <div
          className={styles.editorInner}
          style={{ width: '1000px', height: '300px' }}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={styles.editorInput}
                aria-placeholder={'Enter some text...'}
                placeholder={
                  <div className={styles.placeholderText}>
                    Enter some text...
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  )
}
