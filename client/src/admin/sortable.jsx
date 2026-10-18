import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { findContainer } from './sortableUtils';
import styles from './Admin.module.css';

// Общий drag & drop для админки (фото и видео), мышкой и пальцем.
//
// Пока тянешь, раскладка не меняется — подсвечивается карточка, на место которой встанет
// перетаскиваемая, а переставляется всё в момент отпускания. Живая перестановка тут не
// подходит: галереи сайта раскладываются через nth-child (размер ячейки зависит от номера),
// и после каждого сдвига под указателем оказывается другая карточка — фото «уезжает».
// Под курсором/пальцем летит копия карточки (DragOverlay), соседи не сдвигаются.

const noTransforms = () => null;

// Предпочитаем карточку под указателем, затем раздел под указателем (пустой ряд, промежуток),
// иначе ближайшую карточку.
function collision(args) {
  const hits = pointerWithin(args);
  const itemHits = hits.filter((h) => typeof h.id === 'number');
  if (itemHits.length) return itemHits;
  return hits.length ? hits : closestCenter(args);
}

// canMove(from, to) — можно ли переносить между разделами (по умолчанию только внутри своего).
const sameList = (from, to) => from === to;

export function SortableBoard({ lists, setLists, onCommit, renderOverlay, canMove = sameList, children }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    // мышь: перетаскивание начинается после сдвига на 6px — обычный клик по кнопкам работает
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // палец: долгое нажатие, чтобы обычный свайп продолжал прокручивать страницу
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || over.id === active.id) return;

    const from = findContainer(lists, active.id);
    const to = findContainer(lists, over.id);
    if (!from || !to || !canMove(from, to)) return;

    const fromItems = lists[from];
    const activeIndex = fromItems.findIndex((x) => x.id === active.id);
    const overIsList = over.id in lists;
    let next;

    if (from === to) {
      const overIndex = overIsList ? fromItems.length - 1 : fromItems.findIndex((x) => x.id === over.id);
      if (overIndex < 0 || overIndex === activeIndex) return;
      next = { ...lists, [from]: arrayMove(fromItems, activeIndex, overIndex) };
    } else {
      const toItems = lists[to] || [];
      const overIndex = overIsList ? toItems.length : toItems.findIndex((x) => x.id === over.id);
      next = {
        ...lists,
        [from]: fromItems.filter((x) => x.id !== active.id),
        [to]: [...toItems.slice(0, overIndex), fromItems[activeIndex], ...toItems.slice(overIndex)],
      };
    }

    setLists(next);
    onCommit(next, [...new Set([from, to])], lists);
  };

  const activeItem = activeId == null
    ? null
    : Object.values(lists).flat().find((x) => x.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeItem ? <div className={styles.dragOverlay}>{renderOverlay(activeItem)}</div> : null}
      </DragOverlay>
    </DndContext>
  );
}

// Контейнер одного раздела: принимает перенос даже когда пустой.
export function SortableList({ id, items, className, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <SortableContext id={id} items={items.map((x) => x.id)} strategy={noTransforms}>
      <div
        ref={setNodeRef}
        className={`${className || ''} ${styles.dropZone} ${!items.length ? styles.dropZoneEmpty : ''} ${isOver ? styles.dropZoneOver : ''}`}
      >
        {children}
        {!items.length && <span className={styles.dropZoneHint}>Пусто — перетащите сюда</span>}
      </div>
    </SortableContext>
  );
}

// Перетаскиваемый элемент. className — классы ячейки сайта (чтобы раскладка совпадала).
export function SortableItem({ id, className, style, children }) {
  const { setNodeRef, attributes, listeners, isDragging, isOver } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${className || ''} ${styles.sortable} ${isDragging ? styles.sortableDragging : ''} ${isOver && !isDragging ? styles.dropTarget : ''}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
