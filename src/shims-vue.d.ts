declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}
// declare module "vue-masonry" {
//     export const VueMasonryPlugin: any;
// }
// declare module "vue-grid-layout" {
//     export const VueGridLayout: any;
// }
// declare module "vue-swal" {
//   export const VueSwal: any;
// }
// declare module "Draggabilly" {
//     export const Draggabilly: any;
// }
// declare module draggabilly {
//     export class Draggabilly {
//         x: number;
//         y: number;
//         constructor(container: any, options: any);
//         disable(): void;
//         enable(): void;
//         destroy(): void;
//     }
// }
// import Draggabilly = draggabilly.Draggabilly;

// declare module "draggabilly" {
//     import Draggabilly = draggabilly.Draggabilly;
//     export const Draggabilly;
// }

// declare module "packery" {
//     export const Packery: any;
// }

declare function swal(): void;
