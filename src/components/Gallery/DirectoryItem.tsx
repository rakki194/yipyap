// src/components/Gallery/DirectoryItem.tsx
interface DirectoryItemProps {
    path: string;
    name: string;
    isParent?: boolean;
  }
  
  export const DirectoryItem = (props: DirectoryItemProps) => {
    return (
      <div class="item directory">
        <a href={`/${props.path}`} class="directory-link">
          <i class={`ri-${props.isParent ? 'arrow-up' : 'folder'}-line`} />
          <span>{props.isParent ? '..' : props.name}</span>
        </a>
      </div>
    );
  };