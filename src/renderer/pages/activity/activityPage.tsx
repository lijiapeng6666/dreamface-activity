import React, { useState } from 'react';
import { Paper, Stack } from '@mui/material';
import PresetGallery from '../../components/activity/PresetGallery';
import ControlPanel from '../../components/activity/ControlPanel';

function ActivityPage(): React.ReactElement {
  // Mock data for presets, this would typically come from an API
  const presets = [
    { id: '1', name: '顶部背景图', key: 'titleBanner' },
    { id: '2', name: 'livePhoto Banner', key: 'livePhotoBanner' },
    { id: '3', name: 'AI Video Banner', key: 'aiVideoBanner' },
    { id: '4', name: 'AIGC Banner', key: 'aigcBanner' },
    { id: '5', name: 'Instagram Icon', key: 'instagramIcon' },
    { id: '6', name: 'Twitter Icon', key: 'twitterIcon' },
    { id: '7', name: 'TikTok Icon', key: 'tiktokIcon' },
  ];

  const [uploadedFilePaths, setUploadedFilePaths] = useState<
    Record<string, string>
  >({});

  const handleUploadSuccess = (key: string, filePath: string) => {
    setUploadedFilePaths((prev) => ({
      ...prev,
      [key]: filePath,
    }));
    // You can also log here to see the state being updated
    // console.log('File paths updated:', { ...uploadedFilePaths, [key]: filePath });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack spacing={4}>
        <PresetGallery
          presets={presets}
          onUploadSuccess={handleUploadSuccess}
        />
        <ControlPanel uploadedFilePaths={uploadedFilePaths} />
      </Stack>
    </Paper>
  );
}

export default ActivityPage;
