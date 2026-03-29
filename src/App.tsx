import { useState, type ReactNode } from 'react'
import './App.css'
import { MultiFileDiff, WorkerPoolContextProvider } from '@pierre/diffs/react'

function App() {
  return (
    <>
      <section id="center" >
        <div style={{
          width: '100%',
          maxWidth: "800px"
        }}>
          <ClientComponent />
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App





function ClientComponent() {
  const [ contentA, setContentA ] = useState(oldFile.contents)
  const [ contentB, setContentB ] = useState(newFile.contents)
  const [ filenameA, setFilenameA ] = useState(oldFile.name)
  const [ filenameB, setFilenameB ] = useState(newFile.name)

  return (
    <HighlightProvider>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <input type="text" value={filenameA} onChange={e => setFilenameA(e.target.value)} />
        <input type="text" value={filenameB} onChange={e => setFilenameB(e.target.value)} />
        <textarea value={contentA} onChange={e => setContentA(e.target.value)} className="w-full h-64" />
        <textarea value={contentB} onChange={e => setContentB(e.target.value)} className="w-full h-64" />
      </div>
      <MultiFileDiff
        style={{
          textAlign: 'left',
        }}
        oldFile={{ name: filenameA, contents: contentA, lang: "yaml" }}
        newFile={{ name: filenameB, contents: contentB, lang: "yaml" }}
      />
    </HighlightProvider>
  )
}

const oldFile = {
  name: 'notes.txt',
  contents: `The quick brown fox jumps over the lazy dog.
Pack my box with five dozen liquor jugs.
How vexingly quick daft zebras jump.
The five boxing wizards jump quickly.
Bright vixens jump; dozy fowl quack.
`,
}

const newFile = {
  name: 'notes.txt',
  contents: `The quick brown fox leaps over the lazy dog.
Pack my box with five dozen liquor jugs.
How vexingly quick daft zebras jump.
Sphinx of black quartz, judge my vow.
The five boxing wizards jump quickly.
Bright vixens jump; dozy fowl quack.
Jackdaws love my big sphinx of quartz.
`,
}


import WorkerUrl from '@pierre/diffs/worker/worker.js?worker&url'

export function workerFactory(): Worker {
  return new Worker(WorkerUrl, { type: 'module' })
}


function HighlightProvider({ children }: { children: ReactNode }) {
  return (
    <WorkerPoolContextProvider
      poolOptions={{
        workerFactory,
        // poolSize defaults to 8. More workers = more parallelism but
        // also more memory. Too many can actually slow things down.
        // poolSize: 8,
      }}
      highlighterOptions={{
        // theme: { dark: 'pierre-dark', light: 'pierre-light' },
        // Optional: pick the Shiki engine ('shiki-js' is default)
        // preferredHighlighter: 'shiki-wasm',
        // Optionally preload languages to avoid lazy-loading delays
        // langs: [ 'typescript', 'javascript', 'css', 'html' ],
      }}
    >
      {children}
    </WorkerPoolContextProvider>
  )
}
