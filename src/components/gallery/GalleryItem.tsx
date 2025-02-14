import { Component } from 'solid-js';
import styles from './GalleryItem.module.css';

// Add this type definition at the top of the file, after the imports
interface GalleryImage {
  thumbnailUrl: string;
  title: string;
  favoriteNumber?: number;
}

const GalleryItem: Component<{ image: GalleryImage }> = (props) => {
  return (
    <div class={styles.itemContainer} style={{ position: 'relative' }}>
      <img src={props.image.thumbnailUrl} alt={props.image.title} />
      {props.image.favoriteNumber != null && (
        <span class={styles.favoriteBadge}>{props.image.favoriteNumber}</span>
      )}
    </div>
  );
};

export default GalleryItem; 