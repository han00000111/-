import { useState } from 'react';

export function ExportConfirmModal({ description, note, onCancel, onConfirm }) {
  const [format, setFormat] = useState('Excel');

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="confirm-modal export-modal" role="dialog" aria-modal="true" aria-labelledby="export-title">
        <div className="confirm-modal-head">
          <strong id="export-title">导出当前结果</strong>
          <span>前端模拟导出</span>
        </div>
        <p>{description}</p>
        <div className="export-format-options" role="radiogroup" aria-label="导出格式">
          {['Excel', 'CSV'].map((item) => (
            <label className={format === item ? 'active' : ''} key={item}>
              <input type="radio" name="export-format" value={item} checked={format === item} onChange={() => setFormat(item)} />
              {item}
            </label>
          ))}
        </div>
        <div className="export-note">{note}</div>
        <div className="confirm-modal-actions">
          <button type="button" onClick={onCancel}>取消</button>
          <button type="button" onClick={() => onConfirm(format)}>确认导出</button>
        </div>
      </div>
    </div>
  );
}
