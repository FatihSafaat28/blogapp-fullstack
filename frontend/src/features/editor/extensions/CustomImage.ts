import Image from '@tiptap/extension-image';

// Extended Custom Image Extension with word-like alignment and size controls
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 'medium',
        parseHTML: (element) => {
          if (element.classList.contains('img-size-small')) return 'small';
          if (element.classList.contains('img-size-full')) return 'full';
          return 'medium';
        },
        renderHTML: (attributes) => ({
          class: `img-size-${attributes.size || 'medium'} img-align-${
            attributes.alignment || 'center'
          } ${attributes.hasOutline !== false ? 'img-outline' : ''} ${
            attributes.hasShadow !== false ? 'img-shadow' : ''
          }`,
        }),
      },
      alignment: {
        default: 'center',
        parseHTML: (element) => {
          if (element.classList.contains('img-align-left')) return 'left';
          if (element.classList.contains('img-align-right')) return 'right';
          return 'center';
        },
      },
      hasOutline: {
        default: true,
      },
      hasShadow: {
        default: true,
      },
    };
  },
});
