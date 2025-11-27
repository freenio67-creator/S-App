import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Check } from 'lucide-react';

export const CodePlayground: React.FC = () => {
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>Start coding!</p>');
  const [css, setCss] = useState('body { font-family: sans-serif; padding: 20px; }\nh1 { color: #4f46e5; }');
  const [js, setJs] = useState('console.log("Hello from JS!");');
  const [srcDoc, setSrcDoc] = useState('');

  const runCode = () => {
    const doc = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (err) {
              console.error(err);
              document.body.innerHTML += '<div style="color:red; margin-top:20px">JS Error: ' + err.message + '</div>';
            }
          </script>
        </body>
      </html>
    `;
    setSrcDoc(doc);
  };

  useEffect(() => {
    // Auto-run on mount
    runCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Code Playground</h2>
          <p className="text-slate-500 text-sm">Write HTML, CSS, and JS and see the result instantly.</p>
        </div>
        <div className="flex space-x-2">
           <button 
            onClick={() => { setHtml(''); setCss(''); setJs(''); }}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button 
            onClick={runCode}
            className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors font-medium"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
        {/* Editors */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col">
            <div className="bg-slate-800 px-4 py-2 text-slate-300 text-xs font-mono uppercase tracking-wider border-b border-slate-700">HTML</div>
            <textarea 
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="flex-1 w-full bg-slate-900 text-indigo-100 p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
          <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col">
            <div className="bg-slate-800 px-4 py-2 text-slate-300 text-xs font-mono uppercase tracking-wider border-b border-slate-700">CSS</div>
            <textarea 
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="flex-1 w-full bg-slate-900 text-emerald-100 p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
          <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col">
            <div className="bg-slate-800 px-4 py-2 text-slate-300 text-xs font-mono uppercase tracking-wider border-b border-slate-700">JavaScript</div>
            <textarea 
              value={js}
              onChange={(e) => setJs(e.target.value)}
              className="flex-1 w-full bg-slate-900 text-amber-100 p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
           <div className="bg-slate-50 px-4 py-2 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200 flex justify-between items-center">
             <span>Live Preview</span>
             <span className="flex items-center text-green-600"><Check className="w-3 h-3 mr-1"/> Ready</span>
           </div>
           <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            className="w-full h-full bg-white"
           />
        </div>
      </div>
    </div>
  );
};