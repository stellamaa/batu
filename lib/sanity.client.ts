import { createClient } from 'next-sanity';
import config from '../sanity.congif';

export const sanityClient = createClient({
  projectId: 'ccx6q9vb',
  dataset: 'production',
  apiVersion: '2026-03-04',
  useCdn: false,
  perspective: 'previewDrafts',
});

