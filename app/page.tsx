import './refine.css';
import HomeClient from './HomeClient';
import { loadHomeContent } from '../lib/cms/repository';

export const dynamic = 'force-dynamic';

export default async function Home(){
  const content=await loadHomeContent();
  return <HomeClient content={content}/>;
}
