import { useEffect, useRef, type PointerEvent } from 'react';

interface GroupPickerProps {
  groups: string[];
  selected: string;
  onSelect(group: string): void;
}

export function GroupPicker({ groups, selected, onSelect }: GroupPickerProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    function handleWheel(event: WheelEvent) {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }
      const canScroll = list!.scrollWidth > list!.clientWidth;
      if (!canScroll) {
        return;
      }
      event.preventDefault();
      list!.scrollLeft += event.deltaY;
    }
    list.addEventListener('wheel', handleWheel, { passive: false });
    return () => list.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('.group-chip--active');
    active?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  }, [selected]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') {
      return;
    }
    dragRef.current = { startX: event.clientX, startScroll: listRef.current!.scrollLeft, moved: false };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 4) {
      drag.moved = true;
    }
    listRef.current!.scrollLeft = drag.startScroll - delta;
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function handleSelect(group: string) {
    if (dragRef.current?.moved) {
      return;
    }
    onSelect(group);
  }

  return (
    <div className="groups-wrap">
      <div
        ref={listRef}
        className="groups"
        role="tablist"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {groups.map((group) => (
          <button
            key={group}
            type="button"
            role="tab"
            aria-selected={group === selected}
            className={`group-chip ${group === selected ? 'group-chip--active' : ''}`}
            onClick={() => handleSelect(group)}
          >
            {group}
          </button>
        ))}
      </div>
    </div>
  );
}
