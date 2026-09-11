import './globals.css';
import './logo.css';
import './gravacoes/recordings-spacing.css';
import './gravacoes/recordings-editor-preview.css';
import type { Metadata } from 'next';
import FloatingAIChat from './FloatingAIChat';
import GlobalFloatingTools from './GlobalFloatingTools';
import HeroSlidePhotoEnhancer from './HeroSlidePhotoEnhancer';
import AnalysisVideoControls from './AnalysisVideoControls';
import SelectedRecordingAnalysisBridge from './SelectedRecordingAnalysisBridge';

export const metadata: Metadata = {
  title: 'ZYVO — Videoconferência de alta performance',
  description: 'Converse, evolua e alcance resultados em cada reunião.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <HeroSlidePhotoEnhancer />
        <SelectedRecordingAnalysisBridge />
        <AnalysisVideoControls />
        <GlobalFloatingTools />
        <FloatingAIChat />
      </body>
    </html>
  );
}
