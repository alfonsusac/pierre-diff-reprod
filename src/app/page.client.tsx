"use client"

import { MultiFileDiff, WorkerPoolContextProvider } from "@pierre/diffs/react"
import { useState, type ReactNode } from "react"

export function ClientComponent() {
  const [ contentA, setContentA ] = useState(oldFile.contents)
  const [ contentB, setContentB ] = useState(newFile.contents)
  const [ filenameA, setFilenameA ] = useState(oldFile.name)
  const [ filenameB, setFilenameB ] = useState(newFile.name)

  return (
    <HighlightProvider>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" value={filenameA} onChange={e => setFilenameA(e.target.value)} />
        <input type="text" value={filenameB} onChange={e => setFilenameB(e.target.value)} />
        <textarea value={contentA} onChange={e => setContentA(e.target.value)} className="w-full h-64" />
        <textarea value={contentB} onChange={e => setContentB(e.target.value)} className="w-full h-64" />
      </div>
      <MultiFileDiff
        oldFile={{ name: filenameA, contents: contentA }}
        newFile={{ name: filenameB, contents: contentB }}
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
};



export function workerFactory(): Worker {
  return new Worker(
    new URL(
      '@pierre/diffs/worker/worker.js',
      import.meta.url
    )
  )
}

export function HighlightProvider({ children }: { children: ReactNode }) {
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
