// Вспомогательное для drag & drop админки (sortable.jsx) — отдельный файл, чтобы
// sortable.jsx экспортировал только компоненты (fast refresh).

// lists: { section: [{ id, ... }] }. Item id — число из БД, id контейнера — ключ раздела,
// так что они не пересекаются.
export function findContainer(lists, id) {
  if (id in lists) return id;
  return Object.keys(lists).find((k) => lists[k].some((x) => x.id === id));
}

// Кнопки поверх карточки не должны запускать перетаскивание.
export const stopDrag = {
  onMouseDown: (e) => e.stopPropagation(),
  onTouchStart: (e) => e.stopPropagation(),
  onKeyDown: (e) => e.stopPropagation(),
};

// Перемещение одного элемента кнопками («в начало», «в конец», «в другой ряд»).
export function moveItem(lists, id, toSection, toIndex) {
  const from = findContainer(lists, id);
  const item = lists[from].find((x) => x.id === id);
  const next = { ...lists, [from]: lists[from].filter((x) => x.id !== id) };
  const target = next[toSection] || [];
  const index = toIndex === 'end' ? target.length : toIndex;
  next[toSection] = [...target.slice(0, index), item, ...target.slice(index)];
  return next;
}
