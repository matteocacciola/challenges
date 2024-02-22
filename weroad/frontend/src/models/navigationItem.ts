import type { FunctionalComponent } from "vue";

export declare type NavigationItem = {
    name: string;
    href: string;
    icon?: FunctionalComponent;
    current: boolean;
};
