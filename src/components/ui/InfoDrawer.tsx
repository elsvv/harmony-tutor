import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Drawer } from './Drawer';

interface InfoDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    content: string | null;
    fallbackTitle?: string;
    emptyText?: string;
}

export const InfoDrawer: React.FC<InfoDrawerProps> = ({
    isOpen,
    onClose,
    title,
    content,
    fallbackTitle = 'Информация',
    emptyText = 'Информация недоступна',
}) => {
    return (
        <Drawer isOpen={isOpen} onClose={onClose} side="right" title={title || fallbackTitle}>
            {content ? (
                <div className="px-6 py-4">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className="text-lg font-bold text-stone-900 mb-4 pb-3 border-b border-stone-200">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="text-base font-semibold text-stone-800 mt-6 mb-3">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="text-sm font-semibold text-stone-700 mt-4 mb-2">
                                    {children}
                                </h3>
                            ),
                            p: ({ children }) => (
                                <p className="text-sm text-stone-600 leading-relaxed mb-3">
                                    {children}
                                </p>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-semibold text-stone-800">{children}</strong>
                            ),
                            em: ({ children }) => (
                                <em className="italic text-stone-500">{children}</em>
                            ),
                            code: ({ children }) => (
                                <code className="px-1.5 py-0.5 bg-stone-100 text-stone-700 text-xs font-mono rounded">
                                    {children}
                                </code>
                            ),
                            pre: ({ children }) => (
                                <pre className="bg-stone-900 text-stone-100 p-4 rounded-lg overflow-x-auto text-xs my-3">
                                    {children}
                                </pre>
                            ),
                            ul: ({ children }) => (
                                <ul className="my-2 ml-4 space-y-1">{children}</ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="my-2 ml-4 space-y-1 list-decimal">{children}</ol>
                            ),
                            li: ({ children }) => (
                                <li className="text-sm text-stone-600 leading-relaxed pl-1">
                                    <span className="flex gap-2">
                                        <span className="text-stone-400">•</span>
                                        <span>{children}</span>
                                    </span>
                                </li>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-stone-300 pl-4 my-3 text-stone-500 italic">
                                    {children}
                                </blockquote>
                            ),
                            hr: () => <hr className="my-6 border-stone-200" />,
                            table: ({ children }) => (
                                <div className="overflow-x-auto my-4">
                                    <table className="w-full text-sm border-collapse">
                                        {children}
                                    </table>
                                </div>
                            ),
                            thead: ({ children }) => (
                                <thead className="bg-stone-50">{children}</thead>
                            ),
                            th: ({ children }) => (
                                <th className="px-3 py-2 text-left text-xs font-semibold text-stone-600 border-b border-stone-200">
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className="px-3 py-2 text-sm text-stone-600 border-b border-stone-100">
                                    {children}
                                </td>
                            ),
                            a: ({ children, href }) => (
                                <a
                                    href={href}
                                    className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            ) : (
                <div className="text-center text-stone-400 py-12">
                    <p>{emptyText}</p>
                </div>
            )}
        </Drawer>
    );
};

export default InfoDrawer;
