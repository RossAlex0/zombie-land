import SidebarNav from './SidebarNav';
import styles from './sidebar.module.scss';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <SidebarNav />
    </aside>
  );
}
