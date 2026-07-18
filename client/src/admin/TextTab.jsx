import { useEffect, useState } from 'react';
import { adminApi } from './adminApi';
import { GROUPS, FIELDS } from './textSchema';
import styles from './Admin.module.css';

function TextField({ field, value, onSave }) {
  const [draft, setDraft] = useState(value ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const dirty = draft !== (value ?? '');
  const Tag = field.type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={styles.textField}>
      <label>{field.label}</label>
      <Tag
        rows={field.type === 'textarea' ? 4 : undefined}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button className={styles.saveBtn} onClick={save} disabled={!dirty || saving}>
        {saving ? 'Сохраняю...' : 'Сохранить'}
      </button>
      {saved && <span className={styles.savedTag}>Сохранено</span>}
    </div>
  );
}

// value приходит от TextTab только после загрузки (родитель рендерит поля лишь когда
// список контента уже получен), поэтому достаточно начального состояния — переоткрытие
// вкладки создаёт новый инстанс компонента и новое начальное значение.
function ListField({ field, value, onSave }) {
  const [items, setItems] = useState(Array.isArray(value) ? value : []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (i, v) => setItems((arr) => arr.map((x, idx) => (idx === i ? v : x)));
  const remove = (i) => setItems((arr) => arr.filter((_, idx) => idx !== i));
  const add = () => setItems((arr) => [...arr, '']);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave(items.filter((s) => s.trim() !== ''));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.textField}>
      <label>{field.label}</label>
      {items.map((item, i) => (
        <div className={styles.listRow} key={i}>
          <input value={item} onChange={(e) => update(i, e.target.value)} />
          <button className={styles.iconBtnDanger} onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className={styles.iconBtn} onClick={add}>+ добавить</button>{' '}
      <button className={styles.saveBtn} onClick={save} disabled={saving}>
        {saving ? 'Сохраняю...' : 'Сохранить'}
      </button>
      {saved && <span className={styles.savedTag}>Сохранено</span>}
    </div>
  );
}

function CardListField({ field, value, onSave }) {
  const [items, setItems] = useState(Array.isArray(value) ? value : []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (i, field2, v) =>
    setItems((arr) => arr.map((x, idx) => (idx === i ? { ...x, [field2]: v } : x)));
  const remove = (i) => setItems((arr) => arr.filter((_, idx) => idx !== i));
  const add = () => setItems((arr) => [...arr, { title: '', text: '' }]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave(items.filter((c) => c.title.trim() || c.text.trim()));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.textField}>
      <label>{field.label}</label>
      {items.map((item, i) => (
        <div className={styles.listRow} key={i}>
          <div style={{ flex: 1 }}>
            <input
              placeholder="Заголовок"
              value={item.title}
              onChange={(e) => update(i, 'title', e.target.value)}
              style={{ marginBottom: 6 }}
            />
            <textarea
              placeholder="Текст"
              rows={2}
              value={item.text}
              onChange={(e) => update(i, 'text', e.target.value)}
            />
          </div>
          <button className={styles.iconBtnDanger} onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className={styles.iconBtn} onClick={add}>+ добавить карточку</button>{' '}
      <button className={styles.saveBtn} onClick={save} disabled={saving}>
        {saving ? 'Сохраняю...' : 'Сохранить'}
      </button>
      {saved && <span className={styles.savedTag}>Сохранено</span>}
    </div>
  );
}

function NavLinksField({ field, value, onSave }) {
  const original = Array.isArray(value) ? value : [];
  const [labels, setLabels] = useState(original.map((l) => l.label));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const merged = original.map((l, i) => ({ ...l, label: labels[i] }));
      await onSave(merged);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.textField}>
      <label>{field.label}</label>
      {original.map((l, i) => (
        <div className={styles.listRow} key={l.to}>
          <input value={labels[i] ?? ''} onChange={(e) => setLabels((arr) => arr.map((x, idx) => (idx === i ? e.target.value : x)))} />
          <span style={{ color: '#666', fontSize: '0.8rem', alignSelf: 'center' }}>{l.to}</span>
        </div>
      ))}
      <button className={styles.saveBtn} onClick={save} disabled={saving}>
        {saving ? 'Сохраняю...' : 'Сохранить'}
      </button>
      {saved && <span className={styles.savedTag}>Сохранено</span>}
    </div>
  );
}

export default function TextTab() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listContent().then((rows) => {
      const map = {};
      rows.forEach((r) => { map[r.key] = r.value; });
      setValues(map);
      setLoading(false);
    });
  }, []);

  const handleSave = async (field, newValue) => {
    await adminApi.updateContent(field.key, newValue, field.group);
    setValues((v) => ({ ...v, [field.key]: newValue }));
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      {GROUPS.map((group) => (
        <div className={styles.sectionBlock} key={group.key}>
          <h2 className={styles.sectionHeading}>{group.label}</h2>
          {FIELDS.filter((f) => f.group === group.key).map((field) => {
            const value = values[field.key];
            if (field.type === 'list') {
              return <ListField key={field.key} field={field} value={value} onSave={(v) => handleSave(field, v)} />;
            }
            if (field.type === 'cardlist') {
              return <CardListField key={field.key} field={field} value={value} onSave={(v) => handleSave(field, v)} />;
            }
            if (field.type === 'navlinks') {
              return <NavLinksField key={field.key} field={field} value={value} onSave={(v) => handleSave(field, v)} />;
            }
            return <TextField key={field.key} field={field} value={value} onSave={(v) => handleSave(field, v)} />;
          })}
        </div>
      ))}
    </div>
  );
}
