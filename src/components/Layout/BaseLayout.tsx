import { ParentComponent } from 'solid-js';
import { Breadcrumb } from './Breadcrumb';

interface BaseLayoutProps {
  currentPath?: string;
}

export const BaseLayout: ParentComponent<BaseLayoutProps> = (props) => {
  return (
    <div class="container">
      <Breadcrumb currentPath={props.currentPath} />
      {props.children}
    </div>
  );
};