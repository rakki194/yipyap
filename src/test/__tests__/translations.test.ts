import { describe, it, expect } from 'vitest';
import en from '../../i18n/en';
import type { GalleryTranslations, TranslationParams } from '../../i18n/types';

type TranslationFunction = (params: TranslationParams) => string;

describe('Translation Messages', () => {
  describe('gallery.uploadProgress', () => {
    const uploadProgress = en.gallery.uploadProgress as TranslationFunction;

    it('should format upload progress message with count', () => {
      const message = uploadProgress({ count: 1 });
      expect(message).toBe('Uploading 1 file...');

      const messagePlural = uploadProgress({ count: 5 });
      expect(messagePlural).toBe('Uploading 5 files...');
    });

    it('should handle zero files', () => {
      const message = uploadProgress({ count: 0 });
      expect(message).toBe('Uploading 0 files...');
    });

    it('should handle missing count parameter', () => {
      const message = uploadProgress({});
      expect(message).toBe('Uploading some files...');
    });

    it('should handle invalid count values', () => {
      // @ts-expect-error - Testing runtime behavior with invalid parameter
      const message = uploadProgress({ count: 'invalid' });
      expect(message).toBe('Uploading some files...');
    });
  });

  describe('gallery.confirmMultiDelete', () => {
    const confirmMultiDelete = en.gallery.confirmMultiDelete as TranslationFunction;

    it('should format message with only images', () => {
      const message = confirmMultiDelete({ images: 2 });
      expect(message).toBe('Are you sure you want to delete 2 images?');
    });

    it('should format message with only folders', () => {
      const message = confirmMultiDelete({ folders: 3 });
      expect(message).toBe('Are you sure you want to delete 3 folders?');
    });

    it('should format message with both images and folders', () => {
      const message = confirmMultiDelete({ folders: 2, images: 3 });
      expect(message).toBe('Are you sure you want to delete 2 folders and 3 images?');
    });

    it('should handle zero values', () => {
      const message = confirmMultiDelete({ folders: 0, images: 0 });
      expect(message).toBe('Are you sure you want to delete these items?');
    });

    it('should handle missing parameters', () => {
      const message = confirmMultiDelete({} as { folders: never; images: never });
      expect(message).toBe('Are you sure you want to delete these items?');
    });

    it('should handle invalid values', () => {
      // @ts-expect-error - Testing runtime behavior with invalid parameters
      const message = confirmMultiDelete({ folders: 'invalid', images: 'invalid' });
      expect(message).toBe('Are you sure you want to delete these items?');
    });
  });

  describe('gallery.selectedCount', () => {
    const selectedCount = en.gallery.selectedCount as TranslationFunction;

    it('should format selected count message', () => {
      const message = selectedCount({ count: 1 });
      expect(message).toBe('1 item selected');

      const messagePlural = selectedCount({ count: 3 });
      expect(messagePlural).toBe('3 items selected');
    });

    it('should handle zero selected', () => {
      const message = selectedCount({ count: 0 });
      expect(message).toBe('0 items selected');
    });

    it('should handle missing count parameter', () => {
      const message = selectedCount({});
      expect(message).toBe('some items selected');
    });

    it('should handle invalid count value', () => {
      // @ts-expect-error - Testing runtime behavior with invalid parameter type
      const message = selectedCount({ count: 'invalid' });
      expect(message).toBe('some items selected');
    });
  });

  describe('Null/Undefined Cases', () => {
    const uploadProgress = en.gallery.uploadProgress as TranslationFunction;
    const selectedCount = en.gallery.selectedCount as TranslationFunction;
    const confirmMultiDelete = en.gallery.confirmMultiDelete as TranslationFunction;

    it('should handle undefined parameters', () => {
      // @ts-expect-error - Testing runtime behavior with undefined
      expect(uploadProgress(undefined)).toBe('Uploading some files...');
      // @ts-expect-error - Testing runtime behavior with undefined
      expect(selectedCount(undefined)).toBe('some items selected');
      // @ts-expect-error - Testing runtime behavior with undefined
      expect(confirmMultiDelete(undefined)).toBe('Are you sure you want to delete these items?');
    });

    it('should handle null parameters', () => {
      // @ts-expect-error - Testing runtime behavior with null
      expect(uploadProgress(null)).toBe('Uploading some files...');
      // @ts-expect-error - Testing runtime behavior with null
      expect(selectedCount(null)).toBe('some items selected');
      // @ts-expect-error - Testing runtime behavior with null
      expect(confirmMultiDelete(null)).toBe('Are you sure you want to delete these items?');
    });
  });
}); 