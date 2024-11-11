import { For } from 'solid-js';

interface BreadcrumbProps {
  currentPath?: string;
}

export const Breadcrumb = (props: BreadcrumbProps) => {
  const crumbs = () => props.currentPath?.split('/').filter(Boolean) || [];
  
  return (
    <nav class="breadcrumb">
      <a href="/">home</a>
      <For each={crumbs()}>
        {(crumb, index) => (
          <>
            {' / '}
            <a href={`/${crumbs().slice(0, index() + 1).join('/')}`}>
              {crumb}
            </a>
          </>
        )}
      </For>
    </nav>
  );
};