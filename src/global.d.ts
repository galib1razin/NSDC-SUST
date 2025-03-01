declare module 'svelte-quill' {
    import { SvelteComponent } from 'svelte';
    
    export default class Quill extends SvelteComponent {
      $$prop_def: {
        value?: string;
        placeholder?: string;
        theme?: 'snow' | 'bubble';
        modules?: Record<string, unknown>;
      };
    }
  }
  