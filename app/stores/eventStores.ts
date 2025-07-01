import { create } from 'zustand';
import { persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../Users/userAccount';

export type Event = {
    user: User;
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    description: string | "";
    location: string | "N/A";
    date: string; // ISO string (yyyy-mm-dd)
};

type Store = {
    events: Record<string, Event[]>; // key = date string
    addEvent: (event: Event) => void;
    getEventsByDate: (user: string, date: string) => Event[];
    deleteEvent: (event: Event) => Boolean;
    editEvent: (updatedEvent: Event) => void;
    getEventById:  (user: string, id: string) => Event | undefined;
};

export const useEventStore = create<Store>()(
  persist(
    (set, get) => ({
      events: {},

      addEvent: (event) => {
        const key = event.date;
        const existing = get().events[key] || [];
        set({
          events: {
            ...get().events,
            [key]: [...existing, event],
          },
        });
      },

      editEvent: (updatedEvent) => {
        const key = updatedEvent.date;
        const updatedList = (get().events[key] || []).map((e) =>
          e.id === updatedEvent.id ? updatedEvent : e
        );
        set({
          events: {
            ...get().events,
            [key]: updatedList,
          },
        });
      },

    deleteEvent: (event) => {
        const events = get().events;
        const updatedList = (events[event.date] || []).filter((e) => e.id !== event.id);
        set({ events: { ...events, [event.date]: updatedList } });
        return true;
    },
    
    getEventById: (user, id)=> {
        const events = get().events;
        for (const day in events) {
            const found = events[day].find((e) => e.id === id);
            
            if (found) {
              if (user === found.user.username){
                return found;
              }
            }
        }
        return undefined;
    },

    getEventsByDate: (user, date) => {
        // return get().events[date] || [];
        const events = get().events[date] || [];
        const updatedList = events.filter((e) => e.user?.username === user);
        return updatedList;
      },
    }),
    
    {
      name: 'calendar-events', // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


// export const useEventStore = create<Store>(set, get) => ({
//     events: {},
    
//     addEvent: (event) => {
//         const events = get().events;
//         const key = event.date;
//         const existing = events[key] || [];
//         set({ events: { ...events, [key]: [...existing, event] } });
//     },
//     editEvent: (updatedEvent) => {
//         const events = get().events;
//         const key = updatedEvent.date;
//         const updatedList = (events[key] || []).map((e) =>
//             e.id === updatedEvent.id ? updatedEvent : e
//         );
//         set({ events: { ...events, [key]: updatedList } });
//     },
//     deleteEvent: (event) => {
//         const events = get().events;
//         const updatedList = (events[event.date] || []).filter((e) => e.id !== event.id);
//         set({ events: { ...events, [event.date]: updatedList } });
//         return true;
//     },

//     getEventById: (id)=> {
//     const events = get().events;
//     for (const day in events) {
//       const found = events[day].find((e) => e.id === id);
//       if (found) return found;
//     }
//     return undefined;
//   },
//     getEventsByDate: (date) => {
//         return get().events[date] || [];
//     },
// }));
