
import React, { useState } from 'react';
import { CheckCircleIcon } from './icons/StatusIcons';
import { ClipboardIcon } from './icons/ActionIcons';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 relative">
      <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <p className="text-xs text-gray-400 font-mono capitalize">{language}</p>
        <button
          onClick={handleCopy}
          className="flex items-center text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
        >
          {copied ? (
            <>
              <CheckCircleIcon className="h-4 w-4 mr-1 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="h-4 w-4 mr-1" />
              Copy Code
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-x-auto">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
