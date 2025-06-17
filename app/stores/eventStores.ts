import { create } from 'zustand';

export type Event = {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    description: string | "";
    date: string; // ISO string (yyyy-mm-dd)
};

type Store = {
    events: Record<string, Event[]>; // key = date string
    addEvent: (event: Event) => void;
    getEventsByDate: (date: string) => Event[];
    editEvent: (updatedEvent: Event) => void;
    getEventById:  (id: string) => Event | undefined;
};

export const useEventStore = create<Store>((set, get) => ({
    events: {},
    
    addEvent: (event) => {
        const events = get().events;
        const key = event.date;
        const existing = events[key] || [];
        set({ events: { ...events, [key]: [...existing, event] } });
    },
    editEvent: (updatedEvent) => {
        const events = get().events;
        const key = updatedEvent.date;
        const updatedList = (events[key] || []).map((e) =>
        e.id === updatedEvent.id ? updatedEvent : e
        );
        set({ events: { ...events, [key]: updatedList } });
    },
    getEventById: (id)=> {
    const events = get().events;
    for (const day in events) {
      const found = events[day].find((e) => e.id === id);
      if (found) return found;
    }
    return undefined;
  },
    getEventsByDate: (date) => {
        return get().events[date] || [];
    },
}));
