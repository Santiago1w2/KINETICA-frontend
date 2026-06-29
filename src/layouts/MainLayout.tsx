import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function MainLayout() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateAreas: `
        "header"
        "main"
      `,
      gridTemplateRows: '60px 1fr',
      gridTemplateColumns: '1fr',
      height: '100vh',
      width: '100vw',
      maxWidth: '100%',
      margin: '0',
    }}>
      <header style={{ gridArea: 'header' }}>
        <Navbar />
      </header>
      
      <main style={{ 
        gridArea: 'main', 
        padding: '20px', 
        overflowY: 'auto', 
        backgroundColor: 'var(--background-global)' 
      }}>
        <Outlet /> 

        
      </main>
    </div>
  );
}

export default MainLayout;