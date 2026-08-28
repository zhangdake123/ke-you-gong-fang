/**
 * 题库管理器
 *
 * 查看/编辑/删除题库文件中的条目。
 * 支持展开查看条目详情，编辑题目内容。
 * 跨模块依赖：store/useBankStore
 */
import { useState } from 'react';
import { useBankStore } from '../../store/useBankStore';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { BankEntry } from '../../types';

/** 题型标签 */
const TYPE_LABELS: Record<string, string> = {
  choice: '选择题',
  truefalse: '判断题',
  matching: '配对题',
  memory: '记忆题',
  ordering: '排序题',
  mixed: '综合',
};

export function BankManager() {
  const { files, deleteFile, renameFile, createFile, deleteEntry } = useBankStore();
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      createFile(newFileName.trim());
      setNewFileName('');
      setShowCreate(false);
    }
  };

  const handleRename = (fileId: string) => {
    if (renameValue.trim()) {
      renameFile(fileId, renameValue.trim());
      setRenamingFile(null);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // 获取条目内容摘要
  const getEntrySummary = (entry: BankEntry) => {
    const q = entry.content.questions;
    const p = entry.content.pairs;
    const parts: string[] = [];
    if (q.length > 0) {
      const types = new Set(q.map((q) => q.type));
      parts.push(`${q.length} 题（${Array.from(types).map((t) => TYPE_LABELS[t] || t).join('/')}）`);
    }
    if (p.length > 0) {
      parts.push(`${p.length} 对配对`);
    }
    return parts.join('，') || '空';
  };

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          题库管理
        </h3>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '取消' : '+ 新建文件'}
        </Button>
      </div>

      {/* 新建文件 */}
      {showCreate && (
        <Card>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="文件名（如：三年级上册）"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
            />
            <Button onClick={handleCreateFile} disabled={!newFileName.trim()}>
              创建
            </Button>
          </div>
        </Card>
      )}

      {/* 题库文件列表 */}
      {files.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-sm text-gray-400">
            暂无题库文件，请先创建或从题目编辑页保存题目。
          </div>
        </Card>
      ) : (
        files.map((file) => (
          <Card key={file.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {renamingFile === file.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)}
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleRename(file.id)}>确定</Button>
                    <Button size="sm" variant="ghost" onClick={() => setRenamingFile(null)}>取消</Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setExpandedFile(expandedFile === file.id ? null : file.id)}
                    className="text-left w-full"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium text-gray-800 transition-transform ${expandedFile === file.id ? 'rotate-90' : ''}`}>▶</span>
                      <span className="font-medium text-gray-800">{file.name}</span>
                      <span className="text-xs text-gray-400">{file.entries.length} 条</span>
                    </div>
                    {file.description && (
                      <p className="text-xs text-gray-400 mt-1 ml-5">{file.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5 ml-5">
                      创建于 {formatDate(file.createdAt)} · 更新于 {formatDate(file.updatedAt)}
                    </p>
                  </button>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setRenamingFile(file.id);
                    setRenameValue(file.name);
                  }}
                >
                  ✏️
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`确定删除「${file.name}」？条目将一并删除，不可恢复。`)) {
                      deleteFile(file.id);
                    }
                  }}
                >
                  🗑️
                </Button>
              </div>
            </div>

            {/* 展开条目列表 */}
            {expandedFile === file.id && (
              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                {file.entries.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">暂无条目</p>
                ) : (
                  file.entries.map((entry) => (
                    <div key={entry.id}>
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <button
                          type="button"
                          onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{formatDate(entry.createdAt)}</span>
                            <span className="text-sm font-medium text-gray-700">{entry.title}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 ml-0">
                            {getEntrySummary(entry)}
                          </p>
                        </button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('确定删除此条目？')) {
                              deleteEntry(file.id, entry.id);
                            }
                          }}
                        >
                          🗑️
                        </Button>
                      </div>

                      {/* 展开条目详情 */}
                      {expandedEntry === entry.id && (
                        <div className="ml-4 p-3 bg-gray-50 rounded-lg mt-1 space-y-2">
                          {entry.content.questions.map((q, i) => (
                            <div key={q.id} className="text-sm">
                              <span className="text-gray-400">#{i + 1}</span>
                              {' '}
                              <span className="font-medium">{q.question}</span>
                              {q.type === 'choice' && 'options' in q && (
                                <div className="ml-4 text-gray-500 text-xs">
                                  {q.options.map((opt, oi) => (
                                    <div key={oi} className={oi === q.answer ? 'text-green-600 font-medium' : ''}>
                                      {String.fromCharCode(65 + oi)}. {opt}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.type === 'truefalse' && 'answer' in q && (
                                <div className="ml-4 text-xs text-gray-500">
                                  答案：{q.answer ? '正确' : '错误'}
                                </div>
                              )}
                            </div>
                          ))}
                          {entry.content.pairs.map((p, i) => (
                            <div key={p.id} className="text-sm text-gray-500">
                              <span className="text-gray-400">#{i + 1}</span>
                              {' '}
                              {p.left} ↔ {p.right}
                            </div>
                          ))}
                          {entry.content.questions.length === 0 && entry.content.pairs.length === 0 && (
                            <p className="text-xs text-gray-400">内容为空</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}

export default BankManager;