import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { ResumeData, ResumeSectionKey, TemplateId } from '@/types/resume.types';
import { createEmptyResume } from '@/utils/emptyResume';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import { debounce } from '@/utils/helpers';

type Action =
  | { type: 'SET_RESUME'; payload: ResumeData }
  | { type: 'UPDATE'; payload: Partial<ResumeData> }
  | { type: 'SET_TEMPLATE'; payload: TemplateId }
  | { type: 'REORDER_SECTIONS'; payload: ResumeSectionKey[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };

interface HistoryState {
  past: ResumeData[];
  present: ResumeData;
  future: ResumeData[];
}

function loadInitialResume(): ResumeData {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.RESUME_DRAFT);
    if (stored) return JSON.parse(stored) as ResumeData;
  } catch {
    /* ignore corrupted draft */
  }
  return createEmptyResume();
}

const initialState: HistoryState = {
  past: [],
  present: loadInitialResume(),
  future: [],
};

function withUpdate(state: HistoryState, next: ResumeData): HistoryState {
  return {
    past: [...state.past.slice(-24), state.present],
    present: { ...next, updatedAt: new Date().toISOString() },
    future: [],
  };
}

function reducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case 'SET_RESUME':
      return { past: [], present: action.payload, future: [] };
    case 'UPDATE':
      return withUpdate(state, { ...state.present, ...action.payload });
    case 'SET_TEMPLATE':
      return withUpdate(state, { ...state.present, templateId: action.payload });
    case 'REORDER_SECTIONS':
      return withUpdate(state, { ...state.present, sectionOrder: action.payload });
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
    case 'RESET':
      return { past: [], present: createEmptyResume(), future: [] };
    default:
      return state;
  }
}

interface ResumeContextValue {
  resume: ResumeData;
  updateResume: (payload: Partial<ResumeData>) => void;
  setTemplate: (templateId: TemplateId) => void;
  reorderSections: (order: ResumeSectionKey[]) => void;
  undo: () => void;
  redo: () => void;
  resetResume: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
}

const ResumeContext = createContext<ResumeContextValue | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lastSavedAtRef = useRef<string | null>(null);
  const savingRef = useRef(false);

  // Debounced autosave to localStorage — mirrors a real "save draft" API call.
  const persist = useRef(
    debounce((resume: ResumeData) => {
      savingRef.current = true;
      localStorage.setItem(LOCAL_STORAGE_KEYS.RESUME_DRAFT, JSON.stringify(resume));
      lastSavedAtRef.current = new Date().toISOString();
      savingRef.current = false;
    }, 800),
  ).current;

  useEffect(() => {
    persist(state.present);
  }, [state.present, persist]);

  const updateResume = useCallback((payload: Partial<ResumeData>) => {
    dispatch({ type: 'UPDATE', payload });
  }, []);

  const setTemplate = useCallback((templateId: TemplateId) => {
    dispatch({ type: 'SET_TEMPLATE', payload: templateId });
  }, []);

  const reorderSections = useCallback((order: ResumeSectionKey[]) => {
    dispatch({ type: 'REORDER_SECTIONS', payload: order });
  }, []);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const resetResume = useCallback(() => dispatch({ type: 'RESET' }), []);

  const value: ResumeContextValue = {
    resume: state.present,
    updateResume,
    setTemplate,
    reorderSections,
    undo,
    redo,
    resetResume,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    isSaving: savingRef.current,
    lastSavedAt: lastSavedAtRef.current,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResumeContext() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResumeContext must be used within ResumeProvider');
  return ctx;
}
