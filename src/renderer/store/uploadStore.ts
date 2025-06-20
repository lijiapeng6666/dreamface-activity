import { create } from 'zustand';

interface UploadState {
  hoveredUploadKey: string | null;
  setHoveredUploadKey: (key: string | null) => void;
}

const useUploadStore = create<UploadState>()((set) => ({
  hoveredUploadKey: null,
  setHoveredUploadKey: (key) => set({ hoveredUploadKey: key }),
}));

export default useUploadStore;
