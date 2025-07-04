import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import UploadItem from './UploadItem';
import useUploadStore from '../../store/uploadStore';

// Define Preset interface locally or import from a shared types file
interface Preset {
  id: string;
  name: string;
  key: string;
}

interface PresetGalleryProps {
  presets: Preset[];
  onUploadSuccess: (key: string, filePath: string) => void;
  onImageRemove: (key: string) => void;
}

function PresetGallery({
  presets,
  onUploadSuccess,
  onImageRemove,
}: PresetGalleryProps): React.ReactElement {
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {},
  );
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());

  const handleImageUpload = useCallback(
    async (key: string, file: File) => {
      // Prevent re-uploading if already in progress
      if (loadingKeys.has(key)) return;
      setLoadingKeys((prev) => new Set(prev).add(key));

      try {
        const filePath = (file as any).path;
        let payload: { type: 'path' | 'buffer'; data: string | Uint8Array };

        if (filePath) {
          payload = { type: 'path', data: filePath };
        } else {
          const arrayBuffer = await file.arrayBuffer();
          payload = { type: 'buffer', data: new Uint8Array(arrayBuffer) };
        }

        const result = await window.electron.ipcRenderer.invoke(
          'compress-and-upload',
          payload,
        );

        if (result.success) {
          const previewUrl = `data:image/png;base64,${result.previewData}`;
          setImagePreviews((prev) => ({ ...prev, [key]: previewUrl }));
          onUploadSuccess(key, result.filePath);
        } else {
          throw new Error(result.error || 'Failed to process image');
        }
      } catch (error) {
        console.error('IPC call failed for key:', key, error);
      } finally {
        setLoadingKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [onUploadSuccess, loadingKeys],
  );

  const handleImageRemove = (key: string) => {
    // Remove from local preview state
    setImagePreviews((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    // Notify parent to remove from its state
    onImageRemove(key);
  };

  useEffect(() => {
    const handleGlobalPaste = (event: ClipboardEvent) => {
      const hoveredKey = useUploadStore.getState().hoveredUploadKey;

      if (!hoveredKey) {
        return;
      }

      const { items } = event.clipboardData || {};
      if (!items) return;

      for (let i = 0; i < items.length; i += 1) {
        if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageUpload(hoveredKey, file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);

    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handleImageUpload]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
      }}
    >
      {presets.map((preset) => (
        <UploadItem
          key={preset.id}
          preset={preset}
          isLoading={loadingKeys.has(preset.key)}
          imageUrl={imagePreviews[preset.key] || null}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />
      ))}
    </Box>
  );
}

export default PresetGallery;
