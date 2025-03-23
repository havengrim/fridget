declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  declare module "maz-ui/components/MazBackdrop.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  