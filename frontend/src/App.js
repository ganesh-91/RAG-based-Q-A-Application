import './App.css';
import Auth from './auth';
import QAInterface from './chat';
import DocumentManagement from './documentManagement';
import IngestionManagement from './ingestionManagement';
import UserManagement from './userManagement';

function App() {
  return (
    <div>
      <Auth />
      <UserManagement />
      <DocumentManagement />
      <IngestionManagement />
      <QAInterface />
    </div>
  );
}

export default App;
